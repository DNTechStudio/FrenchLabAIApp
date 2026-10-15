import { getSavedVoiceURI, saveVoiceURI, getSavedSpeed } from './voicePresets.js';

export class VoiceSynthesizer {
  constructor({ onStart = null, onEnd = null, onError = null } = {}) {
    this.synth = (typeof window !== 'undefined') ? window.speechSynthesis : null;
    this.frenchVoice = null;
    this.preferredVoiceURI = getSavedVoiceURI();
    this.defaultRate = getSavedSpeed(1.0);
    this.onStart = onStart;
    this.onEnd = onEnd;
    this.onError = onError;

    this.initVoices();
  }

  static rankVoice(voice) {
    if (!voice || !voice.lang) return 999;
    const name = (voice.name || '').toLowerCase();
    const uri = (voice.voiceURI || '').toLowerCase();
    const lang = (voice.lang || '').toLowerCase();

    if (!lang.startsWith('fr')) return 999;

    // Tier 1: Neural and Online Natural voices (Edge, Azure, etc.)
    if (/online.*natural|natural.*french|neural/i.test(name) || /online.*natural|natural.*french|neural/i.test(uri)) {
      return 10;
    }
    // Tier 2: Enhanced platform voices (Google français, Apple Enhanced, Thomas, Audrey, Denise, Henri)
    if (/google\s*français|enhanced|thomas|audrey|amelie|denise|henri/i.test(name)) {
      return 20;
    }
    // Tier 3: Dedicated fr-FR voices
    if (/^fr[-_]fr$/i.test(lang)) {
      return 30;
    }
    // Tier 4: Regional French
    return 40;
  }

  static clampRate(rate) {
    const r = parseFloat(rate);
    if (isNaN(r)) return 1.0;
    return Math.min(2.0, Math.max(0.5, r));
  }

  clampRate(rate) {
    return VoiceSynthesizer.clampRate(rate);
  }

  static rankVoices(voices = []) {
    return [...voices].sort((a, b) => VoiceSynthesizer.rankVoice(a) - VoiceSynthesizer.rankVoice(b));
  }

  rankVoices(voices = []) {
    return VoiceSynthesizer.rankVoices(voices);
  }

  initVoices() {
    if (!this.synth) return;

    const findVoice = () => {
      const voices = this.getAvailableFrenchVoices();
      if (voices.length > 0) {
        if (this.preferredVoiceURI) {
          const matched = voices.find(v => v.voiceURI === this.preferredVoiceURI);
          this.frenchVoice = matched || voices[0];
        } else {
          this.frenchVoice = voices[0];
        }
      }
    };

    findVoice();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = findVoice;
    }
  }

  getAvailableFrenchVoices() {
    if (!this.synth) return [];
    try {
      const allVoices = this.synth.getVoices() || [];
      const frenchVoices = allVoices.filter(v => v.lang && v.lang.toLowerCase().startsWith('fr'));
      frenchVoices.sort((a, b) => VoiceSynthesizer.rankVoice(a) - VoiceSynthesizer.rankVoice(b));
      return frenchVoices;
    } catch (e) {
      return [];
    }
  }

  setVoiceURI(voiceURI) {
    if (!voiceURI) return;
    this.preferredVoiceURI = voiceURI;
    saveVoiceURI(voiceURI);
    const voices = this.getAvailableFrenchVoices();
    const matched = voices.find(v => v.voiceURI === voiceURI);
    if (matched) {
      this.frenchVoice = matched;
    }
  }

  speak(textOrOptions, maybeOptions = {}) {
    let text = '';
    let options = {};

    if (typeof textOrOptions === 'object' && textOrOptions !== null) {
      text = textOrOptions.text || '';
      options = { ...textOrOptions, ...maybeOptions };
    } else {
      text = String(textOrOptions ?? '');
      options = { ...maybeOptions };
    }

    const rawRate = options.rate ?? this.defaultRate ?? 1.0;
    // Safe bounds clamping (0.5x to 2.0x) to avoid distortion or browser audio glitches
    const rate = Math.min(2.0, Math.max(0.5, rawRate));
    const pitch = options.pitch ?? 1.0;
    const onStart = options.onStart || this.onStart;
    const onEnd = options.onEnd || this.onEnd;
    const onError = options.onError || this.onError;

    if (!this.synth) {
      // Immediate fallback if synthesis not supported
      if (onStart) onStart();
      if (onEnd) onEnd();
      return Promise.resolve();
    }

    this.cancel();

    // Ensure voices are initialized if they were loaded asynchronously
    if (!this.frenchVoice) {
      const voices = this.getAvailableFrenchVoices();
      if (voices.length > 0) {
        this.frenchVoice = voices[0];
      }
    }

    let targetVoice = this.frenchVoice;
    if (options.voiceURI) {
      const available = this.getAvailableFrenchVoices();
      const matched = available.find(v => v.voiceURI === options.voiceURI);
      if (matched) targetVoice = matched;
    }

    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = targetVoice?.lang || 'fr-FR';
      utterance.rate = rate;
      utterance.pitch = pitch;

      if (targetVoice) {
        utterance.voice = targetVoice;
      }

      utterance.onstart = () => {
        if (onStart) onStart();
      };

      utterance.onend = () => {
        if (onEnd) onEnd();
        resolve();
      };

      utterance.onerror = (err) => {
        if (onError) onError(err);
        resolve();
      };

      if (this.synth.paused) {
        this.synth.resume();
      }

      this.synth.speak(utterance);
    });
  }

  stop() {
    this.cancel();
  }

  cancel() {
    if (this.synth && (this.synth.speaking || this.synth.pending)) {
      this.synth.cancel();
    }
  }

  isSpeaking() {
    return !!(this.synth && this.synth.speaking);
  }
}

