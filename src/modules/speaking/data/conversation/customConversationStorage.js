/**
 * customConversationStorage.js: LocalStorage CRUD & validation for custom user-created conversation scenarios
 */

import { CONVERSATION_SCENARIOS, getRandomConversationScenario } from './conversationScenarios.js';

const STORAGE_KEY = 'delf_speaking_custom_conversations';

export function getCustomConversationScenarios() {
  try {
    const storage = typeof window !== 'undefined' ? window.localStorage : (typeof localStorage !== 'undefined' ? localStorage : null);
    if (!storage) return [];
    const raw = storage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read custom conversation scenarios:', err);
    return [];
  }
}

export function saveCustomConversationScenario(scenarioData) {
  const validated = validateCustomConversationScenario(scenarioData);
  const existing = getCustomConversationScenarios();

  const newScenario = {
    ...validated,
    id: `custom-conv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    isCustom: true
  };

  const updated = [newScenario, ...existing];
  try {
    const storage = typeof window !== 'undefined' ? window.localStorage : (typeof localStorage !== 'undefined' ? localStorage : null);
    if (storage) {
      storage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (err) {
    console.error('Failed to persist custom conversation scenario:', err);
  }

  return newScenario;
}

export function deleteCustomConversationScenario(id) {
  const existing = getCustomConversationScenarios();
  const filtered = existing.filter(s => s.id !== id);
  try {
    const storage = typeof window !== 'undefined' ? window.localStorage : (typeof localStorage !== 'undefined' ? localStorage : null);
    if (storage) {
      storage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
  } catch (err) {}
  return filtered;
}

export function validateCustomConversationScenario(data) {
  if (!data) throw new Error("Les données du scénario sont requises.");

  const title = (data.title || '').trim();
  if (title.length < 5) {
    throw new Error("Le titre du scénario doit contenir au moins 5 caractères.");
  }

  const category = (data.category || '').trim();
  if (!category) {
    throw new Error("Veuillez sélectionner une catégorie valide pour la situation.");
  }

  const context = (data.context || '').trim();
  if (context.length < 10) {
    throw new Error("La description du contexte doit contenir au moins 10 caractères.");
  }

  const objective = (data.objective || '').trim();
  if (objective.length < 5) {
    throw new Error("L'objectif communicatif doit contenir au moins 5 caractères.");
  }

  const participantCount = Number(data.participantCount) === 3 ? 3 : 2;
  const defaultLevel = data.defaultLevel || 'B1';

  let characters = data.characters;
  if (!Array.isArray(characters) || characters.length < participantCount) {
    if (participantCount === 3) {
      characters = [
        { id: 'char-user', name: data.userRole || 'Vous (Participant)', isUser: true, role: 'Rôle principal' },
        { id: 'char-ai-1', name: data.partner1Name || 'Interlocuteur A', isUser: false, role: data.partner1Role || 'Partenaire de discussion', voiceGender: 'female' },
        { id: 'char-ai-2', name: data.partner2Name || 'Interlocuteur B', isUser: false, role: data.partner2Role || 'Second intervenant', voiceGender: 'male' }
      ];
    } else {
      characters = [
        { id: 'char-user', name: data.userRole || 'Vous (Participant)', isUser: true, role: 'Rôle principal' },
        { id: 'char-ai-1', name: data.partner1Name || 'Interlocuteur', isUser: false, role: data.partner1Role || 'Partenaire de dialogue', voiceGender: 'female' }
      ];
    }
  }

  const initialTurnText = (data.initialTurnText || '').trim() ||
    `Bonjour ! Nous sommes réunis pour : ${title}. Comment souhaitez-vous procéder ?`;

  const initialTurn = {
    speakerId: characters[1]?.id || 'char-ai-1',
    text: initialTurnText
  };

  return {
    title,
    category,
    participantCount,
    defaultLevel,
    context,
    objective,
    characters,
    initialTurn
  };
}

export function getAllConversationScenarios() {
  const custom = getCustomConversationScenarios();
  return [...CONVERSATION_SCENARIOS, ...custom];
}

export function getRandomCombinedConversationScenario({ category = null, participantCount = null } = {}) {
  const all = getAllConversationScenarios();
  let filtered = all;
  if (category) filtered = filtered.filter(s => s.category === category);
  if (participantCount) filtered = filtered.filter(s => s.participantCount === Number(participantCount));
  if (filtered.length === 0) filtered = all;
  const index = Math.floor(Math.random() * filtered.length);
  return { ...filtered[index] };
}
