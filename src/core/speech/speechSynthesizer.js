/**
 * Speech Synthesis Service for French Lab AI (002-dictation-module)
 * Interfaces with window.speechSynthesis, auto-detects optimal French voices,
 * supports playback rate adjustment (1.0x vs 0.8x slow mode), and handles headless environments.
 *
 * CHROMIUM WORKAROUNDS IMPLEMENTED:
 * 1. Resume Queue Freeze: Chromium freezes its TTS engine if cancel() is invoked while paused === true.
 *    Fix: Always call synth.resume() before synth.cancel().
 * 2. Asynchronous Cancel Race: Chromium cancel() triggers asynchronous error/end events that could leak into
 *    new sentences. Fix: Session tokens (utterance._id vs currentUtteranceId).
 * 3. Broken Native Resume: Chrome on Windows drops utterances when resume() is called after pause().
 *    Fix: Substring-based resume from paused word position.
 * 4. Missing onboundary Events: Chrome network voices (e.g. Google français) do not emit onboundary events.
 *    Fix: Hybrid tracking — uses onboundary if available, otherwise estimates word position via elapsed time
 *    (rate * 12.5 chars/sec) rewound to the nearest word boundary.
 */

import { googleCloudTtsService, GOOGLE_CLOUD_FRENCH_VOICES } from './googleCloudTtsService.js';

export class SpeechSynthesizer {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.cloudTtsService = googleCloudTtsService;
    this.activeAudio = null;         // HTML5 Audio instance khi phát giọng Google Cloud
    this.voices = [];
    this.selectedVoice = null;
    this.isPlaying = false;
    this.isPaused = false;
    this.currentUtterance = null;
    this.currentUtteranceId = 0;
    this.currentText = '';
    this.currentOptions = null;
    this.currentCharIndex = 0;       // Vị trí ký tự/từ hiện tại phục vụ resume đọc tiếp
    this.startCharIndex = 0;         // Vị trí ký tự bắt đầu của phiên phát âm
    this.utteranceStartTime = 0;     // Mốc thời gian bắt đầu phát âm (ms)
    this.hasBoundaryEvents = false;  // Cờ nhận biết giọng đọc có hỗ trợ onboundary hay không
    this.onVoicesChanged = null;
    this.onFallback = null;          // Callback khi có lỗi Cloud TTS và phải fallback về Web Speech

    if (this.synth) {
      this.initVoices();
      if (typeof this.synth.onvoiceschanged !== 'undefined') {
        this.synth.onvoiceschanged = () => {
          this.initVoices();
          if (typeof this.onVoicesChanged === 'function') {
            this.onVoicesChanged(this.getFrenchVoices());
          }
        };
      }
    }
  }

  /**
   * Đánh giá và xếp hạng độ tự nhiên của giọng đọc tiếng Pháp.
   * Ưu tiên các giọng Google Cloud Studio/Neural, sau đó đến Neural / Natural (Edge/Azure) và Enhanced OS (Apple/Windows)
   */
  static rankVoice(voice) {
    if (!voice || !voice.lang) return 999;
    if (voice.isCloud) {
      return 5; // Tier 0: Google Cloud Studio / Neural2 (top rank)
    }
    const name = (voice.name || '').toLowerCase();
    const uri = (voice.voiceURI || '').toLowerCase();
    const lang = (voice.lang || '').toLowerCase();

    if (!lang.startsWith('fr')) return 999;

    // Tier 1: Neural & Online Natural (Microsoft Denise/Henri Online, Edge Natural, Azure Neural) - Tự nhiên nhất
    if (/online.*natural|natural.*french|neural/i.test(name) || /online.*natural|natural.*french|neural/i.test(uri)) {
      return 10;
    }

    // Tier 2: Enhanced platform & OS voices (Apple Enhanced, Thomas, Audrey, Amélie, Paul, Julie, Hortense)
    if (/enhanced|thomas|audrey|amelie|paul|julie|hortense|mathieu/i.test(name)) {
      return 20;
    }

    // Tier 3: Google voices (Google français)
    if (/google\s*français|google/i.test(name)) {
      return 30;
    }

    // Tier 4: Giọng chuẩn Pháp fr-FR
    if (/^fr[-_]fr$/i.test(lang)) {
      return 40;
    }

    // Tier 5: Giọng tiếng Pháp khu vực khác (fr-CA, fr-BE, fr-CH...)
    return 50;
  }

  /**
   * Định dạng tên giọng đọc cho dropdown thân thiện và đẹp mắt.
   */
  static formatVoiceName(voice) {
    if (!voice) return 'Voix système par défaut';
    if (voice.isCloud) {
      return `${voice.styleBadge || '🌟'} ${voice.name} [Cloud AI]`;
    }
    const rawName = voice.name || 'Voix française';
    const isNatural = /online.*natural|natural|neural/i.test(rawName);

    let cleanName = rawName
      .replace(/^microsoft\s+/i, '')
      .replace(/\s+online\s*\(natural\)/i, '')
      .replace(/\s*-\s*french\s*\(france\)/i, ' (France)')
      .replace(/\s*-\s*french\s*\(canada\)/i, ' (Canada)')
      .replace(/\s*-\s*french\s*\(belgium\)/i, ' (Belgique)')
      .replace(/\s*-\s*french\s*\(switzerland\)/i, ' (Suisse)')
      .replace(/\s*\(français\)/i, '')
      .replace(/google\s+français/i, 'Google Français')
      .trim();

    if (isNatural) {
      return `✨ ${cleanName} [Naturel]`;
    }
    return `🗣️ ${cleanName}`;
  }

  initVoices() {
    if (this.synth) {
      this.voices = this.synth.getVoices() || [];
    }

    const frenchVoices = this.getFrenchVoices();
    if (frenchVoices.length > 0) {
      let savedURI = null;
      try {
        if (typeof localStorage !== 'undefined') {
          savedURI = localStorage.getItem('frenchlab_dictation_voice');
        }
      } catch (e) {}

      if (savedURI) {
        const found = frenchVoices.find(v =>
          v.voiceURI === savedURI ||
          v.name === savedURI ||
          v.voiceId === savedURI ||
          v.voiceURI === `gcloud:${savedURI}` ||
          (savedURI.startsWith('gcloud:') && v.voiceId === savedURI.slice(7))
        );
        if (found) {
          this.selectedVoice = found;
          return;
        }
      }

      if (this.cloudTtsService && !this.cloudTtsService.hasApiKey()) {
        const localVoice = frenchVoices.find(v => !v.isCloud);
        if (localVoice) {
          this.selectedVoice = localVoice;
          return;
        }
      }

      this.selectedVoice = frenchVoices[0];
    }
  }

  getFrenchVoices(options = { includeCloud: true }) {
    const cloudVoices = (options && options.includeCloud === false) ? [] : GOOGLE_CLOUD_FRENCH_VOICES;
    let localFrench = [];
    if (this.synth) {
      try {
        const all = this.synth.getVoices() || [];
        localFrench = all.filter(v => v.lang && v.lang.toLowerCase().startsWith('fr'));
      } catch (e) {}
    }
    const combined = [...cloudVoices, ...localFrench];
    return combined.sort((a, b) => SpeechSynthesizer.rankVoice(a) - SpeechSynthesizer.rankVoice(b));
  }

  setVoice(voiceURI) {
    if (!voiceURI) return false;
    const voices = this.getFrenchVoices();
    const found = voices.find(v =>
      v.voiceURI === voiceURI ||
      v.name === voiceURI ||
      v.voiceId === voiceURI ||
      v.voiceURI === `gcloud:${voiceURI}` ||
      (voiceURI.startsWith('gcloud:') && v.voiceId === voiceURI.slice(7))
    );
    if (found) {
      this.selectedVoice = found;
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('frenchlab_dictation_voice', found.voiceURI);
        }
      } catch (e) {}
      return true;
    }
    return false;
  }

  isAvailable() {
    return !!this.synth || !!this.cloudTtsService;
  }

  /**
   * Phát âm một câu văn tiếng Pháp (tự động định tuyến giữa Cloud TTS và Web Speech API).
   */
  speakSentence(text, options = {}, startCharIndex = 0) {
    if (!text || !text.trim()) return;

    this.currentText = text;
    this.currentOptions = options;
    this.currentCharIndex = startCharIndex;
    this.startCharIndex = startCharIndex;
    this.hasBoundaryEvents = false;
    this.utteranceStartTime = 0;
    const utteranceId = ++this.currentUtteranceId;

    // 1. Nếu giọng được chọn là Google Cloud AI
    if (this.selectedVoice?.isCloud) {
      this.speakCloudSentence(text, options, utteranceId, startCharIndex);
      return;
    }

    // 2. Mặc định: Web Speech API
    this.speakWebSpeech(text, options, utteranceId, startCharIndex);
  }

  /**
   * Tổng hợp và phát âm qua Google Cloud Text-to-Speech
   */
  async speakCloudSentence(text, options = {}, utteranceId, startCharIndex = 0) {
    this.isPlaying = true;
    this.isPaused = false;
    if (typeof options.onStart === 'function') options.onStart();

    // Dừng audio cũ nếu đang phát
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
      } catch (e) {}
      this.activeAudio = null;
    }

    try {
      const result = await this.cloudTtsService.synthesize({
        text,
        voiceId: this.selectedVoice.voiceId,
        rate: options.rate || 1.0
      });

      if (utteranceId !== this.currentUtteranceId) return;

      if (typeof Audio !== 'undefined') {
        const audio = new Audio(result.audioUrl);
        // Tốc độ speakingRate đã được Google Cloud xử lý tự nhiên qua payload synthesis
        audio.playbackRate = 1.0;
        this.activeAudio = audio;

        audio.onended = () => {
          if (utteranceId !== this.currentUtteranceId) return;
          this.isPlaying = false;
          this.isPaused = false;
          this.activeAudio = null;
          if (typeof options.onEnd === 'function') options.onEnd();
        };

        audio.onerror = (err) => {
          if (utteranceId !== this.currentUtteranceId) return;
          this.isPlaying = false;
          this.isPaused = false;
          this.activeAudio = null;
          if (typeof options.onError === 'function') options.onError(err);
        };

        await audio.play();
      } else {
        // Môi trường headless unit test
        this.mockTimeout = setTimeout(() => {
          if (utteranceId !== this.currentUtteranceId) return;
          this.isPlaying = false;
          this.isPaused = false;
          if (typeof options.onEnd === 'function') options.onEnd();
        }, 50);
      }
    } catch (err) {
      if (utteranceId !== this.currentUtteranceId) return;
      console.warn('Google Cloud TTS gặp sự cố hoặc thiếu API key, chuyển sang Web Speech:', err);
      
      const localVoices = this.getFrenchVoices({ includeCloud: false });
      const fallbackVoice = this.findBestLocalFrenchVoice(this.selectedVoice?.gender);

      if (typeof this.onFallback === 'function') {
        this.onFallback({
          error: err,
          requestedVoice: this.selectedVoice,
          fallbackVoice: fallbackVoice || (localVoices.length > 0 ? localVoices[0] : null)
        });
      }

      // Fallback an toàn sang Web Speech cục bộ với giọng tiếng Pháp khớp nhất
      this.speakWebSpeech(text, options, utteranceId, startCharIndex, fallbackVoice);
    }
  }

  /**
   * Tìm giọng đọc tiếng Pháp cục bộ tối ưu trong trình duyệt, ưu tiên khớp giới tính với giọng Cloud
   */
  findBestLocalFrenchVoice(targetGender = null) {
    const localVoices = this.getFrenchVoices({ includeCloud: false });
    if (!localVoices || localVoices.length === 0) return null;

    if (targetGender) {
      const isFemale = targetGender === 'female';
      const matched = localVoices.find(v => {
        const n = (v.name || '').toLowerCase();
        if (isFemale) return /female|femme|hortense|julie|denise|audrey|amelie|claire|camille|elise/i.test(n);
        return /male|homme|paul|henri|mathieu|thomas|julien|antoine/i.test(n);
      });
      if (matched) return matched;
    }

    return localVoices[0] || null;
  }

  /**
   * Phát âm qua Web Speech API truyền thống
   */
  speakWebSpeech(text, options = {}, utteranceId, startCharIndex = 0, forcedVoice = null) {
    if (!this.synth || typeof SpeechSynthesisUtterance === 'undefined') {
      // Môi trường headless hoặc unit test (không có Web Speech API)
      this.isPlaying = true;
      this.isPaused = false;
      this.currentMockOnEnd = options.onEnd;
      if (typeof options.onStart === 'function') options.onStart();
      if (typeof options.onEnd === 'function') {
        this.mockTimeout = setTimeout(() => {
          if (utteranceId !== this.currentUtteranceId) return;
          this.isPlaying = false;
          this.isPaused = false;
          this.currentCharIndex = 0;
          options.onEnd();
        }, 50);
      }
      return;
    }

    // [Chromium Workaround] Luôn unpause trước khi cancel để tránh treo vĩnh viễn hàng đợi TTS
    if (this.synth.paused) {
      this.synth.resume();
    }
    if (this.synth.speaking || this.synth.pending) {
      this.synth.cancel();
    }
    this.isPaused = false;

    // Trích xuất đoạn văn bản còn lại nếu đang Resume đọc tiếp từ vị trí tạm dừng
    const textToSpeak = startCharIndex > 0 ? text.slice(startCharIndex) : text;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance._id = utteranceId;
    utterance.lang = options.lang || 'fr-FR';
    utterance.rate = options.rate !== undefined ? options.rate : 1.0;
    utterance.pitch = options.pitch || 1.0;

    if (forcedVoice) {
      utterance.voice = forcedVoice;
    } else if (this.selectedVoice && !this.selectedVoice.isCloud) {
      utterance.voice = this.selectedVoice;
    } else {
      // Đảm bảo luôn gán một giọng tiếng Pháp cục bộ thay vì để mặc định OS
      const bestLocal = this.findBestLocalFrenchVoice(this.selectedVoice?.gender);
      if (bestLocal) {
        utterance.voice = bestLocal;
      }
    }

    // Lắng nghe sự kiện ranh giới từ (nếu giọng đọc hỗ trợ)
    utterance.onboundary = (event) => {
      if (utterance._id !== this.currentUtteranceId) return;
      if (typeof event.charIndex === 'number') {
        this.hasBoundaryEvents = true;
        this.currentCharIndex = startCharIndex + event.charIndex;
      }
    };

    utterance.onstart = () => {
      if (utterance._id !== this.currentUtteranceId) return;
      this.isPlaying = true;
      this.isPaused = false;
      this.utteranceStartTime = performance.now();
      if (typeof options.onStart === 'function') options.onStart();
    };

    utterance.onend = () => {
      if (utterance._id !== this.currentUtteranceId) return;
      if (this.isPaused) return;
      this.isPlaying = false;
      this.isPaused = false;
      this.currentUtterance = null;
      this.currentCharIndex = 0;
      this.utteranceStartTime = 0;
      if (typeof options.onEnd === 'function') options.onEnd();
    };

    utterance.onerror = (err) => {
      if (utterance._id !== this.currentUtteranceId) return;
      if (this.isPaused) return;
      this.isPlaying = false;
      this.isPaused = false;
      this.currentUtterance = null;
      this.currentCharIndex = 0;
      this.utteranceStartTime = 0;
      if (typeof options.onError === 'function') options.onError(err);
    };

    this.currentUtterance = utterance;
    this.isPlaying = true;

    // [Chromium Workaround] Đệm 15ms để tiến trình IPC hủy câu cũ ổn định trước khi xếp hàng câu mới
    setTimeout(() => {
      if (utterance._id !== this.currentUtteranceId) return;
      if (this.synth.paused) {
        this.synth.resume();
      }
      this.synth.speak(utterance);
    }, 15);
  }

  /**
   * Tạm dừng phát âm câu hiện tại.
   */
  pause() {
    this.isPlaying = false;
    this.isPaused = true;

    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
      } catch (e) {}
      return;
    }

    // [Chromium Workaround] Nếu giọng đọc không gửi onboundary (như Google français),
    // ước lượng vị trí từ dựa trên thời gian đã phát thực tế và tốc độ đọc tiếng Pháp tiêu chuẩn
    if (!this.hasBoundaryEvents && this.utteranceStartTime > 0 && this.currentText) {
      const elapsedSec = (performance.now() - this.utteranceStartTime) / 1000;
      const rate = this.currentOptions?.rate || 1.0;
      const charsSpoken = Math.floor(elapsedSec * 12.5 * rate);
      const targetIndex = this.startCharIndex + charsSpoken;

      if (targetIndex > this.startCharIndex && targetIndex < this.currentText.length) {
        const spaceIdx = this.currentText.lastIndexOf(' ', targetIndex);
        if (spaceIdx > this.startCharIndex) {
          this.currentCharIndex = spaceIdx + 1;
        } else {
          this.currentCharIndex = targetIndex;
        }
      }
    }

    if (this.synth) {
      if (this.synth.paused) {
        this.synth.resume();
      }
      this.synth.cancel();
    } else if (this.mockTimeout) {
      clearTimeout(this.mockTimeout);
      this.mockTimeout = null;
    }
  }

  /**
   * Tiếp tục đọc phần còn lại của câu từ vị trí vừa tạm dừng.
   */
  resume() {
    if (!this.currentText) return;
    this.isPaused = false;
    this.isPlaying = true;

    if (this.activeAudio) {
      try {
        this.activeAudio.play();
      } catch (e) {}
      return;
    }

    if (!this.synth) {
      if (this.currentMockOnEnd) {
        this.mockTimeout = setTimeout(() => {
          this.isPlaying = false;
          this.isPaused = false;
          this.currentMockOnEnd();
        }, 50);
      }
      return;
    }

    const resumeIndex = this.currentCharIndex || 0;
    const remaining = this.currentText.slice(resumeIndex);
    if (remaining.trim().length > 0) {
      this.speakSentence(this.currentText, this.currentOptions, resumeIndex);
    } else {
      this.speakSentence(this.currentText, this.currentOptions, 0);
    }
  }

  /**
   * Dừng hẳn phát âm và làm sạch mọi trạng thái phiên đọc.
   */
  stop() {
    this.currentUtteranceId++;
    this.currentCharIndex = 0;
    this.startCharIndex = 0;
    this.utteranceStartTime = 0;
    this.hasBoundaryEvents = false;

    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
      } catch (e) {}
      this.activeAudio = null;
    }

    if (this.synth) {
      if (this.synth.paused) {
        this.synth.resume();
      }
      this.synth.cancel();
    }
    if (this.mockTimeout) {
      clearTimeout(this.mockTimeout);
      this.mockTimeout = null;
    }
    this.isPlaying = false;
    this.isPaused = false;
    this.currentUtterance = null;
  }
}

export const speechSynthesizer = new SpeechSynthesizer();
