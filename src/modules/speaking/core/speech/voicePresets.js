/**
 * voicePresets: Speed options, voice ranking heuristics, and persistence helpers
 */

export const SPEED_STORAGE_KEY = 'delf_speaking_tts_speed';
export const VOICE_STORAGE_KEY = 'delf_speaking_tts_voice_uri';

export const SPEED_PRESETS = [
  { value: 0.75, rate: 0.75, labelKey: 'practice.speed_slow', defaultLabel: '0.75x (Lent)', badge: '0.75x', targetAudience: 'A1-B1' },
  { value: 0.90, rate: 0.90, labelKey: 'practice.speed_moderate', defaultLabel: '0.9x (Modéré)', badge: '0.9x', targetAudience: 'B1-B2' },
  { value: 1.00, rate: 1.00, labelKey: 'practice.speed_normal', defaultLabel: '1.0x (Normal)', badge: '1.0x', targetAudience: 'B2-C1' },
  { value: 1.20, rate: 1.20, labelKey: 'practice.speed_fast', defaultLabel: '1.2x (Rapide)', badge: '1.2x', targetAudience: 'C1-C2' }
];

export function getSavedSpeed(defaultSpeed = 1.0) {
  try {
    const storage = (typeof window !== 'undefined' ? window.localStorage : (typeof localStorage !== 'undefined' ? localStorage : null));
    if (storage) {
      const saved = parseFloat(storage.getItem(SPEED_STORAGE_KEY));
      if (!isNaN(saved) && saved >= 0.5 && saved <= 2.0) {
        return saved;
      }
    }
  } catch (e) {}
  return defaultSpeed;
}

export function saveSpeed(speed) {
  try {
    const storage = (typeof window !== 'undefined' ? window.localStorage : (typeof localStorage !== 'undefined' ? localStorage : null));
    if (storage && typeof speed === 'number' && !isNaN(speed)) {
      storage.setItem(SPEED_STORAGE_KEY, String(speed));
    }
  } catch (e) {}
}

export function getSavedVoiceURI() {
  try {
    const storage = (typeof window !== 'undefined' ? window.localStorage : (typeof localStorage !== 'undefined' ? localStorage : null));
    if (storage) {
      return storage.getItem(VOICE_STORAGE_KEY) || '';
    }
  } catch (e) {}
  return '';
}

export function saveVoiceURI(voiceURI) {
  try {
    const storage = (typeof window !== 'undefined' ? window.localStorage : (typeof localStorage !== 'undefined' ? localStorage : null));
    if (storage && typeof voiceURI === 'string') {
      storage.setItem(VOICE_STORAGE_KEY, voiceURI);
    }
  } catch (e) {}
}
