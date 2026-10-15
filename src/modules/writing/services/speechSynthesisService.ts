/**
 * High-Fidelity Speech Synthesis Service for French Dictation
 * Supports:
 * 1. Google Cloud Text-to-Speech (Neural2 / Studio / Journey)
 * 2. OpenAI Audio Speech (nova, onyx, alloy)
 * 3. Browser-native Web Speech API (100% offline, free fallback)
 * 
 * Includes in-memory audio caching for zero-latency replay without API cost.
 */

import { TtsConfig } from '../domain/types.ts';

export class SpeechSynthesisService {
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private activeAudioElement: HTMLAudioElement | null = null;
  private frenchVoice: SpeechSynthesisVoice | null = null;
  private audioCache = new Map<string, string>();

  constructor() {
    this.initVoices();
  }

  private initVoices(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const findVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      // Prioritize natural/neural voices, then fr-FR, then any French dialect
      this.frenchVoice =
        voices.find((v) => v.lang.startsWith('fr') && /natural|neural|online|enhanced/i.test(v.name)) ||
        voices.find((v) => v.lang === 'fr-FR') ||
        voices.find((v) => v.lang.startsWith('fr')) ||
        null;
    };

    findVoice();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = findVoice;
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  /**
   * Main speech entrypoint: routes to Neural Cloud TTS or local Web Speech with automatic fallback.
   */
  public async speak(
    text: string,
    rate: number = 0.85,
    config?: TtsConfig,
    fallbackApiKey?: string
  ): Promise<void> {
    this.cancel(); // Stop any currently playing audio

    if (!config || config.engine === 'webspeech') {
      return this.speakWebSpeech(text, rate);
    }

    if (config.engine === 'google-cloud') {
      const key = (config.googleApiKey || fallbackApiKey || '').trim();
      if (!key) {
        console.warn('Google Cloud TTS selected but no API key provided, falling back to Web Speech.');
        return this.speakWebSpeech(text, rate);
      }

      try {
        await this.speakGoogleCloud(text, rate, config.voiceId, key);
        return;
      } catch (err) {
        console.warn('Google Cloud TTS failed, falling back to Web Speech:', err);
        return this.speakWebSpeech(text, rate);
      }
    }

    if (config.engine === 'openai') {
      const key = (config.openaiApiKey || fallbackApiKey || '').trim();
      if (!key) {
        console.warn('OpenAI TTS selected but no API key provided, falling back to Web Speech.');
        return this.speakWebSpeech(text, rate);
      }

      try {
        await this.speakOpenAI(text, rate, config.voiceId, key);
        return;
      } catch (err) {
        console.warn('OpenAI TTS failed, falling back to Web Speech:', err);
        return this.speakWebSpeech(text, rate);
      }
    }

    return this.speakWebSpeech(text, rate);
  }

  /**
   * Synthesize via Google Cloud Text-to-Speech REST API with in-memory caching
   */
  private async speakGoogleCloud(
    text: string,
    rate: number,
    voiceId: string,
    apiKey: string
  ): Promise<void> {
    const cacheKey = `gcloud:${voiceId}:${rate}:${text}`;
    if (this.audioCache.has(cacheKey)) {
      return this.playAudioUrl(this.audioCache.get(cacheKey)!, rate);
    }

    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
    const payload = {
      input: { text },
      voice: {
        languageCode: 'fr-FR',
        name: voiceId,
        ssmlGender: voiceId.includes('B') || voiceId.includes('F') ? 'MALE' : 'FEMALE',
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: rate,
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Google Cloud TTS API Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    if (!data.audioContent) {
      throw new Error('Google Cloud TTS returned no audioContent');
    }

    const audioUrl = `data:audio/mp3;base64,${data.audioContent}`;
    this.audioCache.set(cacheKey, audioUrl);
    return this.playAudioUrl(audioUrl, rate);
  }

  /**
   * Synthesize via OpenAI Audio Speech REST API with in-memory caching
   */
  private async speakOpenAI(
    text: string,
    rate: number,
    voiceId: string,
    apiKey: string
  ): Promise<void> {
    const cacheKey = `openai:${voiceId}:${rate}:${text}`;
    if (this.audioCache.has(cacheKey)) {
      return this.playAudioUrl(this.audioCache.get(cacheKey)!, rate);
    }

    const url = 'https://api.openai.com/v1/audio/speech';
    const payload = {
      model: 'tts-1',
      input: text,
      voice: voiceId,
      speed: rate,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenAI TTS API Error (${response.status}): ${errText}`);
    }

    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);
    this.audioCache.set(cacheKey, audioUrl);
    return this.playAudioUrl(audioUrl, rate);
  }

  /**
   * Play an audio URL (base64 data URI or blob URL) with playback rate and cancellation support
   */
  private playAudioUrl(url: string, rate: number): Promise<void> {
    return new Promise((resolve) => {
      const audio = new Audio(url);
      audio.playbackRate = rate;
      this.activeAudioElement = audio;

      audio.onended = () => {
        this.activeAudioElement = null;
        resolve();
      };

      audio.onerror = () => {
        this.activeAudioElement = null;
        resolve();
      };

      audio.play().catch((err) => {
        console.warn('Audio playback interrupted or failed:', err);
        this.activeAudioElement = null;
        resolve();
      });
    });
  }

  /**
   * Local browser Web Speech API fallback
   */
  public speakWebSpeech(text: string, rate: number = 0.85): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        return reject(new Error('SpeechSynthesis is not supported on this browser.'));
      }

      this.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = rate;
      utterance.pitch = 1.0;

      if (this.frenchVoice) {
        utterance.voice = this.frenchVoice;
      }

      utterance.onend = () => {
        this.activeUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        this.activeUtterance = null;
        if (event.error === 'canceled' || event.error === 'interrupted') {
          resolve();
        } else {
          resolve(); // Resolve smoothly to prevent app crashing
        }
      };

      this.activeUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    });
  }

  /**
   * Audition / preview a sample sentence in the Settings modal
   */
  public async testVoiceSample(
    config: TtsConfig,
    fallbackApiKey?: string,
    sampleText: string = 'Bonjour, voici un aperçu de ma voix pour votre dictée DELF-DALF.'
  ): Promise<void> {
    await this.speak(sampleText, 1.0, config, fallbackApiKey);
  }

  public pause(): void {
    if (this.activeAudioElement) {
      this.activeAudioElement.pause();
    }
    if (this.isSupported() && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
  }

  public resume(): void {
    if (this.activeAudioElement && this.activeAudioElement.paused) {
      this.activeAudioElement.play().catch((e) => console.warn(e));
    }
    if (this.isSupported() && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }

  public cancel(): void {
    if (this.activeAudioElement) {
      this.activeAudioElement.pause();
      this.activeAudioElement.currentTime = 0;
      this.activeAudioElement = null;
    }
    if (this.isSupported()) {
      window.speechSynthesis.cancel();
      this.activeUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return (
      (this.activeAudioElement !== null && !this.activeAudioElement.paused) ||
      (this.isSupported() && window.speechSynthesis.speaking)
    );
  }

  public clearCache(): void {
    this.audioCache.clear();
  }
}

export const speechSynthesisService = new SpeechSynthesisService();
