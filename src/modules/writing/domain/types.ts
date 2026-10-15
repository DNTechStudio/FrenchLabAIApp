/**
 * Core Domain Types for DELF B2 Writing Practice Application
 */

export type PromptCategory = 'lettre_formelle' | 'essai_argumentatif' | 'article_forum';

export interface Prompt {
  id: string;
  category: PromptCategory;
  title: string;
  scenario: string;
  instructions: string;
  targetWordCount: number;
}

export interface EssayDraft {
  promptId: string;
  content: string;
  wordCount: number;
  lastSavedAt: number;
}

export type DiffType = 'unchanged' | 'removed' | 'added';

export interface DiffToken {
  value: string;
  type: DiffType;
}

export type DelfCriterion = 'sociolinguistic' | 'coherence' | 'grammar' | 'vocabulary';

export interface PedagogicalNote {
  id: string;
  criterion: DelfCriterion;
  title: string;
  originalExcerpt?: string;
  improvedExcerpt: string;
  explanation: string;
}

export interface ImprovementResult {
  promptId: string;
  originalText: string;
  improvedText: string;
  diffTokens: DiffToken[];
  pedagogicalNotes: PedagogicalNote[];
  overallFeedback: string;
  evaluatedAt: number;
  targetLevel?: CEFRLevel;
  isAutonomous?: boolean;
}

export interface ImprovementRequest {
  promptId: string;
  promptTitle: string;
  promptScenario: string;
  promptInstructions: string;
  essayContent: string;
  targetLevel?: CEFRLevel;
  isAutonomous?: boolean;
}

export type MultiLevelResultMap = Partial<Record<CEFRLevel, ImprovementResult>>;

export type AiProvider = 'mock' | 'gemini' | 'openai';

export type TtsEngine = 'webspeech' | 'google-cloud' | 'openai';

export interface FrenchVoiceDescriptor {
  id: string;
  name: string;
  gender: 'female' | 'male';
  provider: TtsEngine;
  styleBadge: string;
  description: string;
}

export interface TtsConfig {
  engine: TtsEngine;
  voiceId: string;
  googleApiKey?: string;
  openaiApiKey?: string;
}

export interface UserSettings {
  provider: AiProvider;
  apiKey?: string;
  theme: 'dark' | 'light';
  language?: SupportedLanguage;
  selectedLevels?: CEFRLevel[];
  ttsConfig?: TtsConfig;
}

export type { SupportConfig } from './constants.ts';
export type { SupportedLanguage, LanguageOption, AppTranslations } from './translations.ts';
export type { CEFRLevel, CEFRLevelInfo } from './cefrLevels.ts';

// Dictation Domain Types (Feature 006)
export type DictationMode = 'sentence' | 'continuous';

export type DictationMistakeCategory = 'accords' | 'accents' | 'homophones' | 'lexique';

export interface DictationMistake {
  id: string;
  category: DictationMistakeCategory;
  expectedWord: string;
  userWord: string;
  explanation: string;
}

export interface DictationSentence {
  index: number;
  text: string;
  wordCount: number;
}

export interface DictationEvaluation {
  accuracy: number;
  totalExpectedWords: number;
  correctWordsCount: number;
  mistakesCount: number;
  mistakes: DictationMistake[];
  diffTokens: DiffToken[];
  evaluatedAt: number;
}

export interface DictationSession {
  promptId: string;
  targetLevel: CEFRLevel;
  referenceText: string;
  sentences: DictationSentence[];
  currentSentenceIndex: number;
  userInput: string;
  speed: number;
  mode: DictationMode;
  isPlaying: boolean;
  evaluation: DictationEvaluation | null;
}

