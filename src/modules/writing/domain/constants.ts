/**
 * Domain constants and configuration for DELF B2 Writing Practice
 */

export interface SupportConfig {
  /** The destination URL for the donation page (e.g. Buy Me a Coffee / Ko-fi) */
  url: string;
  /** Primary label displayed on desktop screens */
  label: string;
  /** Full descriptive accessibility label and title */
  ariaLabel: string;
  /** Whether the button is visible */
  enabled: boolean;
}

export const DEFAULT_SUPPORT_CONFIG: SupportConfig = {
  url: 'https://buymeacoffee.com/writingdelfb2',
  label: 'Offrez-moi un café',
  ariaLabel: 'Offrez-moi un café — Soutenir le projet DELF-DALF Lab Writing',
  enabled: true,
};

import type { FrenchVoiceDescriptor, TtsConfig } from './types.ts';

export const FRENCH_VOICE_CATALOG: FrenchVoiceDescriptor[] = [
  // Local Browser Web Speech
  {
    id: 'webspeech-default',
    name: 'Navigateur Web Speech',
    gender: 'female',
    provider: 'webspeech',
    styleBadge: 'Gratuit & Hors-ligne',
    description: 'Voix synthétique intégrée au navigateur (100% hors-ligne, zéro configuration)',
  },
  // Google Cloud Neural2 / Studio / Journey Voices
  {
    id: 'fr-FR-Neural2-A',
    name: 'Élise (Neural2-A)',
    gender: 'female',
    provider: 'google-cloud',
    styleBadge: 'Naturel ✨',
    description: 'Voix féminine fluide, intonation riche et naturelle avec liaisons soignées',
  },
  {
    id: 'fr-FR-Neural2-B',
    name: 'Julien (Neural2-B)',
    gender: 'male',
    provider: 'google-cloud',
    styleBadge: 'Posé 🎙️',
    description: 'Voix masculine articulée et posée, idéale pour la dictée analytique',
  },
  {
    id: 'fr-FR-Studio-B',
    name: 'Claire (Studio-B)',
    gender: 'female',
    provider: 'google-cloud',
    styleBadge: 'Studio 🌟',
    description: 'Qualité radiodiffusion haute clarté, diction irréprochable et liaisons parfaites',
  },
  {
    id: 'fr-FR-Journey-F',
    name: 'Antoine (Journey-F)',
    gender: 'male',
    provider: 'google-cloud',
    styleBadge: 'Expressif 🔥',
    description: 'Prosodie conversationnelle moderne avec modulations de voix réalistes',
  },
  // OpenAI TTS Voices
  {
    id: 'nova',
    name: 'Nova (OpenAI)',
    gender: 'female',
    provider: 'openai',
    styleBadge: 'Chaleureux 🎧',
    description: 'Voix féminine expressive, timbre chaleureux et excellente fluidité',
  },
  {
    id: 'onyx',
    name: 'Onyx (OpenAI)',
    gender: 'male',
    provider: 'openai',
    styleBadge: 'Profond 🎩',
    description: 'Voix masculine grave, rythme posé et rassurant',
  },
];

export const DEFAULT_TTS_CONFIG: TtsConfig = {
  engine: 'webspeech',
  voiceId: 'webspeech-default',
};
