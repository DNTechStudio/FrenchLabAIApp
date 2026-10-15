/**
 * customPracticeStorage: Local storage persistence and helpers for user-defined practice topics
 */

import { PRACTICE_PROMPTS } from './practicePrompts.js';

export const CUSTOM_PRACTICE_STORAGE_KEY = 'delf_speaking_custom_practice_topics';

/**
 * Validates custom practice topic inputs.
 */
export function validateCustomPracticePrompt(formData = {}) {
  const errors = {};
  const title = (formData.title || '').trim();
  const category = (formData.category || '').trim();
  const description = (formData.description || '').trim();

  if (!title || title.length < 5) {
    errors.title = 'practice.err_missing_title';
  }

  if (!category) {
    errors.category = 'practice.err_missing_category';
  }

  if (!description || description.length < 10) {
    errors.description = 'practice.err_missing_desc';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Retrieves all saved custom practice prompts from localStorage.
 */
export function getCustomPracticePrompts() {
  try {
    const storage = (typeof window !== 'undefined' ? window.localStorage : (typeof localStorage !== 'undefined' ? localStorage : null));
    if (!storage) return [];
    const raw = storage.getItem(CUSTOM_PRACTICE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to parse custom practice prompts from localStorage:', e);
    return [];
  }
}

/**
 * Saves a new custom practice prompt or updates an existing one.
 */
export function saveCustomPracticePrompt(promptData) {
  const current = getCustomPracticePrompts();
  const starter = (promptData.starterSentence || '').trim() || 'À mon avis, ce sujet soulève des questions fondamentales...';

  const newPrompt = {
    id: promptData.id || `custom-practice-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: (promptData.title || '').trim(),
    category: (promptData.category || 'Société & Culture').trim(),
    description: (promptData.description || '').trim(),
    starterSentence: starter,
    sampleQuestions: promptData.sampleQuestions && promptData.sampleQuestions.length > 0
      ? promptData.sampleQuestions
      : [promptData.description.trim()],
    isCustom: true,
    createdAt: promptData.createdAt || Date.now()
  };

  const existingIdx = current.findIndex(p => p.id === newPrompt.id);
  let updated;
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = newPrompt;
  } else {
    updated = [newPrompt, ...current];
  }

  try {
    const storage = (typeof window !== 'undefined' ? window.localStorage : (typeof localStorage !== 'undefined' ? localStorage : null));
    if (storage) {
      storage.setItem(CUSTOM_PRACTICE_STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (e) {
    console.error('Failed to persist custom practice prompt to localStorage:', e);
  }

  return newPrompt;
}

/**
 * Deletes a custom practice prompt by ID.
 */
export function deleteCustomPracticePrompt(id) {
  if (!id) return false;
  const current = getCustomPracticePrompts();
  const filtered = current.filter(p => p.id !== id);
  if (filtered.length === current.length) return false;

  try {
    const storage = (typeof window !== 'undefined' ? window.localStorage : (typeof localStorage !== 'undefined' ? localStorage : null));
    if (storage) {
      storage.setItem(CUSTOM_PRACTICE_STORAGE_KEY, JSON.stringify(filtered));
      return true;
    }
  } catch (e) {
    console.error('Failed to delete custom practice prompt from localStorage:', e);
  }
  return false;
}

/**
 * Combines built-in PRACTICE_PROMPTS with user custom prompts.
 */
export function getAllPracticePrompts() {
  const custom = getCustomPracticePrompts();
  return [...custom, ...PRACTICE_PROMPTS];
}

/**
 * Gets a random practice prompt from the combined pool of standard and custom prompts.
 */
export function getRandomCombinedPracticePrompt() {
  const all = getAllPracticePrompts();
  if (all.length === 0) return PRACTICE_PROMPTS[0];
  const idx = Math.floor(Math.random() * all.length);
  return all[idx];
}
