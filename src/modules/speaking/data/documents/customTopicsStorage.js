/**
 * customTopicsStorage: Local storage persistence and validation helpers for user-defined DELF B2 trigger documents
 */

export const CUSTOM_TOPICS_STORAGE_KEY = 'delf_speaking_custom_topics';

/**
 * Counts French words accurately taking apostrophes and compound hyphens into account.
 * E.g., "l'arbre" -> ["l", "arbre"] = 2 words, "c'est-à-dire" = 4 words
 */
export function countFrenchWords(text) {
  if (!text || typeof text !== 'string') return 0;
  const normalized = text.trim().replace(/['’]/g, ' ');
  const tokens = normalized.match(/[\p{L}\p{N}]+/gu);
  return tokens ? tokens.length : 0;
}

/**
 * Validates custom topic form inputs against DELF B2 pedagogical thresholds.
 */
export function validateCustomTopic(formData = {}) {
  const errors = {};
  const title = (formData.title || '').trim();
  const category = (formData.category || '').trim();
  const content = (formData.content || '').trim();
  const problematique = (formData.problematique || '').trim();
  const wordCount = countFrenchWords(content);

  if (!title || title.length < 5) {
    errors.title = 'custom_topic.err_missing_title';
  }

  if (!category) {
    errors.category = 'custom_topic.err_missing_category';
  }

  if (wordCount < 30) {
    errors.content = 'custom_topic.err_too_short';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    wordCount
  };
}

/**
 * Safely retrieves all custom trigger documents from localStorage.
 */
export function getCustomTopics() {
  try {
    const storage = (typeof window !== 'undefined' ? window.localStorage : (typeof localStorage !== 'undefined' ? localStorage : null));
    if (!storage) return [];
    const raw = storage.getItem(CUSTOM_TOPICS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to parse custom topics from localStorage:', e);
    return [];
  }
}

/**
 * Saves a new custom topic or updates an existing one by id.
 */
export function saveCustomTopic(topicData) {
  const current = getCustomTopics();
  const wordCount = countFrenchWords(topicData.content || '');

  const newDoc = {
    id: topicData.id || `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: (topicData.title || '').trim(),
    category: (topicData.category || 'Société').trim(),
    source: (topicData.source || '').trim() || 'Document personnalisé du candidat',
    vocabularyLevel: 'B2',
    wordCount,
    content: (topicData.content || '').trim(),
    problematique: (topicData.problematique || '').trim(),
    isCustom: true,
    createdAt: topicData.createdAt || Date.now(),
    problematiqueSample: topicData.problematique ? [topicData.problematique.trim()] : []
  };

  // If exists, replace; otherwise prepend
  const existingIdx = current.findIndex(d => d.id === newDoc.id);
  let updated;
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = newDoc;
  } else {
    updated = [newDoc, ...current];
  }

  try {
    const storage = (typeof window !== 'undefined' ? window.localStorage : (typeof localStorage !== 'undefined' ? localStorage : null));
    if (storage) {
      storage.setItem(CUSTOM_TOPICS_STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (e) {
    console.error('Failed to persist custom topic to localStorage:', e);
  }

  return newDoc;
}

/**
 * Deletes a custom topic from localStorage by ID.
 */
export function deleteCustomTopic(id) {
  if (!id) return false;
  const current = getCustomTopics();
  const filtered = current.filter(d => d.id !== id);
  if (filtered.length === current.length) return false;

  try {
    const storage = (typeof window !== 'undefined' ? window.localStorage : (typeof localStorage !== 'undefined' ? localStorage : null));
    if (storage) {
      storage.setItem(CUSTOM_TOPICS_STORAGE_KEY, JSON.stringify(filtered));
      return true;
    }
  } catch (e) {
    console.error('Failed to delete custom topic from localStorage:', e);
  }
  return false;
}
