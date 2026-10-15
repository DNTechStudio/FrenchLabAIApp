/**
 * Google Cloud Text-to-Speech Service (004-google-cloud-tts)
 * Direct integration with Google Cloud Text-to-Speech REST API v1
 * Provides Studio, Neural2, Journey, and WaveNet French voices with client-side caching.
 */

export const GOOGLE_CLOUD_FRENCH_VOICES = [
  {
    voiceURI: 'gcloud:fr-FR-Neural2-A',
    voiceId: 'fr-FR-Neural2-A',
    name: 'Élise (Neural2-A)',
    gender: 'female',
    tier: 'Neural2',
    styleBadge: 'Naturel ✨',
    lang: 'fr-FR',
    isCloud: true,
    description: 'Voix féminine fluide, intonation riche et naturelle avec liaisons soignées.'
  },
  {
    voiceURI: 'gcloud:fr-FR-Neural2-B',
    voiceId: 'fr-FR-Neural2-B',
    name: 'Julien (Neural2-B)',
    gender: 'male',
    tier: 'Neural2',
    styleBadge: 'Posé 🎙️',
    lang: 'fr-FR',
    isCloud: true,
    description: 'Voix masculine articulée et posée, idéale pour la dictée analytique A1-B2.'
  },
  {
    voiceURI: 'gcloud:fr-FR-Studio-B',
    voiceId: 'fr-FR-Studio-B',
    name: 'Claire (Studio-B)',
    gender: 'female',
    tier: 'Studio 🌟',
    styleBadge: 'Studio 🌟',
    lang: 'fr-FR',
    isCloud: true,
    description: 'Qualité radiodiffusion haute clarté, diction irréprochable et liaisons parfaites pour DALF C1-C2.'
  },
  {
    voiceURI: 'gcloud:fr-FR-Journey-F',
    voiceId: 'fr-FR-Journey-F',
    name: 'Antoine (Journey-F)',
    gender: 'male',
    tier: 'Journey 🔥',
    styleBadge: 'Expressif 🔥',
    lang: 'fr-FR',
    isCloud: true,
    description: 'Prosodie conversationnelle moderne avec modulations de voix réalistes.'
  },
  {
    voiceURI: 'gcloud:fr-FR-Wavenet-C',
    voiceId: 'fr-FR-Wavenet-C',
    name: 'Camille (WaveNet-C)',
    gender: 'female',
    tier: 'WaveNet',
    styleBadge: 'Classique 🎧',
    lang: 'fr-FR',
    isCloud: true,
    description: 'Voix de synthèse nơ-ron DeepMind standard, rythme stable et régulier.'
  }
];

export const STORAGE_KEYS = {
  API_KEY: 'frenchlab_google_api_key',
  GEMINI_FALLBACK_KEY: 'frenchlab_gemini_api_key',
  DEFAULT_VOICE: 'frenchlab_dictation_voice'
};

export class GoogleCloudTtsService {
  constructor() {
    this.audioCache = new Map(); // cacheKey -> audioUrl
    this.maxCacheEntries = 100;
    this._memApiKey = '';
  }

  /**
   * Lấy khóa API Google Cloud đã lưu (hoặc fallback sang khóa Gemini đã lưu nếu có)
   */
  getApiKey() {
    try {
      if (typeof localStorage !== 'undefined') {
        return (
          localStorage.getItem(STORAGE_KEYS.API_KEY) ||
          localStorage.getItem(STORAGE_KEYS.GEMINI_FALLBACK_KEY) ||
          ''
        ).trim();
      }
    } catch (e) {
      // Ignore
    }
    return this._memApiKey || '';
  }

  /**
   * Kiểm tra xem đã có API Key được cấu hình hay chưa
   */
  hasApiKey() {
    return Boolean(this.getApiKey());
  }

  /**
   * Lưu khóa API Google Cloud vào localStorage (kèm in-memory cache)
   */
  saveApiKey(key) {
    const cleaned = (key || '').trim();
    this._memApiKey = cleaned;
    try {
      if (typeof localStorage !== 'undefined') {
        if (cleaned) {
          localStorage.setItem(STORAGE_KEYS.API_KEY, cleaned);
        } else {
          localStorage.removeItem(STORAGE_KEYS.API_KEY);
        }
        return true;
      }
    } catch (e) {
      return false;
    }
    return true;
  }

  /**
   * Tạo khóa cache duy nhất cho câu thoại
   */
  getCacheKey(voiceId, rate, text) {
    return `gcloud:${voiceId}:${(rate || 1.0).toFixed(2)}:${text.trim()}`;
  }

  /**
   * Xây dựng payload gửi đến Google Cloud Text-to-Speech API
   */
  buildPayload(text, voiceId = 'fr-FR-Neural2-A', rate = 1.0, pitch = 0.0) {
    const known = GOOGLE_CLOUD_FRENCH_VOICES.find(v => v.voiceId === voiceId || v.voiceURI === voiceId);
    const gender = known ? (known.gender === 'female' ? 'FEMALE' : 'MALE') : (voiceId.endsWith('-B') ? 'MALE' : 'FEMALE');
    return {
      input: { text: text.trim() },
      voice: {
        languageCode: 'fr-FR',
        name: voiceId,
        ssmlGender: gender
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: Math.max(0.5, Math.min(2.0, parseFloat(rate) || 1.0)),
        pitch: Math.max(-20.0, Math.min(20.0, parseFloat(pitch) || 0.0))
      }
    };
  }

  /**
   * Tổng hợp âm thanh từ văn bản qua Google Cloud TTS
   * @param {Object} params
   * @param {string} params.text - Văn bản tiếng Pháp cần đọc
   * @param {string} params.voiceId - Mã giọng (ví dụ: 'fr-FR-Studio-B')
   * @param {number} params.rate - Tốc độ đọc (0.75 hoặc 1.0)
   * @param {string} params.apiKey - Khóa API Google Cloud (nếu không truyền sẽ tự lấy từ localStorage)
   * @returns {Promise<{ audioUrl: string, fromCache: boolean }>}
   */
  async synthesize({ text, voiceId = 'fr-FR-Neural2-A', rate = 1.0, apiKey = null } = {}) {
    if (!text || !text.trim()) {
      throw new Error('Văn bản đọc không được để trống.');
    }

    const cleanVoiceId = (voiceId || '').replace(/^gcloud:/, '') || 'fr-FR-Neural2-A';
    const effectiveRate = parseFloat(rate) || 1.0;
    const cacheKey = this.getCacheKey(cleanVoiceId, effectiveRate, text);

    // 1. Kiểm tra bộ nhớ đệm (Cache Hit) -> 0ms, 0đ API
    if (this.audioCache.has(cacheKey)) {
      return {
        audioUrl: this.audioCache.get(cacheKey),
        fromCache: true
      };
    }

    const key = (apiKey || this.getApiKey()).trim();
    if (!key) {
      const err = new Error('CHƯA_CÓ_API_KEY');
      err.code = 'NO_API_KEY';
      throw err;
    }

    // 2. Chế độ Mock cho môi trường kiểm thử tự động (Unit Test / Headless)
    if (typeof window === 'undefined' || typeof fetch === 'undefined' || key === 'MOCK_TEST_KEY') {
      const mockUrl = `mock-blob://${cacheKey}`;
      this.cacheAudio(cacheKey, mockUrl);
      return { audioUrl: mockUrl, fromCache: false };
    }

    // 3. Gọi Google Cloud TTS REST API
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(key)}`;
    const payload = this.buildPayload(text, cleanVoiceId, effectiveRate);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      let errorMsg = `Google Cloud TTS API Error (${response.status})`;
      let reason = '';
      try {
        const errJson = await response.json();
        if (errJson.error && errJson.error.message) {
          errorMsg = `${errJson.error.message}`;
        }
        if (Array.isArray(errJson.error?.details)) {
          const blocked = errJson.error.details.find(d => d.reason === 'API_KEY_SERVICE_BLOCKED');
          if (blocked) {
            reason = 'API_KEY_SERVICE_BLOCKED';
            errorMsg = `Clé API bloquée pour Text-to-Speech (erreur 403 API_KEY_SERVICE_BLOCKED). Activez l'API Cloud Text-to-Speech et autorisez-la dans les restrictions de votre clé API.`;
          }
        }
      } catch (e) {
        // Fallback to status text
      }
      const err = new Error(errorMsg);
      err.status = response.status;
      if (reason) err.reason = reason;
      throw err;
    }

    const data = await response.json();
    if (!data.audioContent) {
      throw new Error('Google Cloud TTS không trả về nội dung âm thanh (audioContent).');
    }

    // 4. Giải mã base64 sang Blob Object URL
    const byteCharacters = atob(data.audioContent);
    const byteNumbers = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteNumbers], { type: 'audio/mp3' });
    const audioUrl = URL.createObjectURL(blob);

    // 5. Lưu vào cache phiên
    this.cacheAudio(cacheKey, audioUrl);

    return {
      audioUrl,
      fromCache: false
    };
  }

  cacheAudio(cacheKey, audioUrl) {
    if (this.audioCache.size >= this.maxCacheEntries) {
      // Xóa phần tử đầu tiên (LRU cơ bản)
      const firstKey = this.audioCache.keys().next().value;
      if (firstKey) {
        const oldUrl = this.audioCache.get(firstKey);
        if (typeof URL !== 'undefined' && URL.revokeObjectURL && typeof oldUrl === 'string' && oldUrl.startsWith('blob:')) {
          try { URL.revokeObjectURL(oldUrl); } catch (e) {}
        }
        this.audioCache.delete(firstKey);
      }
    }
    this.audioCache.set(cacheKey, audioUrl);
  }

  /**
   * Dọn dẹp toàn bộ bộ nhớ đệm âm thanh
   */
  clearCache() {
    if (typeof URL !== 'undefined' && URL.revokeObjectURL) {
      for (const url of this.audioCache.values()) {
        if (typeof url === 'string' && url.startsWith('blob:')) {
          try { URL.revokeObjectURL(url); } catch (e) {}
        }
      }
    }
    this.audioCache.clear();
  }
}

export const googleCloudTtsService = new GoogleCloudTtsService();
