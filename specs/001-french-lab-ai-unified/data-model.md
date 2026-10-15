# Data Model & Storage Schema: French Lab AI Super-App

**Feature Branch**: `001-french-lab-ai-unified`

**Created**: 2026-10-01

**Associated Specification**: [spec.md](file:///f:/My%20Drive/%2803%29%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/%2801%29%20Projects/TEC-2026-07%20PRO-07%20French%20Lab%20AI/FrenchLabAIApp/specs/001-french-lab-ai-unified/spec.md)

---

## 1. Entities & TypeScript-style Interfaces

### 1.1 Global State & User Preferences
```typescript
interface AppState {
  currentView: 'cockpit' | 'writing' | 'speaking' | 'conversation' | 'debat';
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  locale: 'fr' | 'vi' | 'en' | 'zh';
  ttsSpeed: number; // e.g. 0.75, 1.0, 1.25
  theme: 'dark';
}
```

### 1.2 Writing Submission (Pillar I)
```typescript
interface WritingSubmission {
  id: string; // UUID
  promptId: string;
  promptTitle: string;
  category: 'lettre' | 'essai' | 'article';
  draftText: string;
  wordCount: number;
  targetWords: number; // default: 250
  improvedText?: string;
  diffItems?: Array<{
    type: 'same' | 'added' | 'removed';
    value: string;
  }>;
  scorecard?: {
    consigne: number;      // max 5
    coherence: number;     // max 6
    morphosyntaxe: number; // max 7
    lexique: number;       // max 7
    total: number;         // max 25
  };
  pedagogicalNotes?: string[];
  createdAt: string; // ISO 8601
}
```

### 1.3 Speaking Session (Pillar II)
```typescript
interface SpeakingSession {
  id: string;
  triggerDocId: string;
  triggerTitle: string;
  scratchpadNotes: string;
  monologueTranscript: string;
  debateExchanges: Array<{
    speaker: 'examiner' | 'candidate';
    text: string;
    audioUrl?: string;
    timestamp: string;
  }>;
  elevationB2?: string;
  elevationC1?: string;
  scorecard?: {
    monologue: number;    // max 6
    interaction: number;  // max 6
    lexique: number;      // max 5
    morphosyntaxe: number;// max 5
    phonologie: number;   // max 3
    total: number;        // max 25
  };
  createdAt: string;
}
```

### 1.4 Daily Conversation Session (Pillar III)
```typescript
interface ConversationSession {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  partyMode: '2-party' | '3-party';
  level: string;
  participants: Array<{
    id: string;
    name: string;
    role: string;
    avatar: string;
    isUser: boolean;
  }>;
  messages: Array<{
    id: string;
    senderId: string;
    senderName: string;
    text: string;
    elevationSuggestion?: string;
    timestamp: string;
  }>;
  createdAt: string;
}
```

### 1.5 Débat Arena Session (Pillar IV)
```typescript
interface DebateSession {
  id: string;
  topicId: string;
  topicTitle: string;
  theme: string;
  userStance: 'pour' | 'contre';
  rounds: Array<{
    roundNumber: number;
    aiArgument: string;
    userRebuttal: string;
    detectedConnectors: Array<{
      connector: string;
      category: 'cause' | 'consequence' | 'opposition' | 'concession' | 'conclusion';
    }>;
  }>;
  scorecard?: {
    relevanceAndDepth: number;  // max 5
    connectorFluency: number;   // max 5
    concessionRefutation: number; // max 5
    abstractLexicon: number;    // max 5
    convictionPacing: number;   // max 5
    total: number;              // max 25
  };
  createdAt: string;
}
```

---

## 2. Local Storage Keys & Sovereign Schema

The application persists all student records locally using namespaced keys in `localStorage`:

| Storage Key | Type | Description |
| :--- | :--- | :--- |
| `frenchlab_preferences` | JSON Object | Stores user CEFR level, locale, TTS playback speed, audio volume. |
| `frenchlab_writing_drafts` | JSON Object | Maps `promptId` $\to$ active essay draft text. |
| `frenchlab_writing_history` | JSON Array | Array of completed `WritingSubmission` objects. |
| `frenchlab_speaking_history` | JSON Array | Array of completed `SpeakingSession` objects. |
| `frenchlab_conversation_history` | JSON Array | Array of completed `ConversationSession` objects. |
| `frenchlab_debate_history` | JSON Array | Array of completed `DebateSession` objects. |
| `frenchlab_custom_scenarios` | JSON Array | User-created custom conversational roleplays. |

### 2.1 Backup & Export JSON Structure
```json
{
  "version": "1.0.0",
  "exportedAt": "2026-10-01T22:30:00.000Z",
  "preferences": {},
  "writingHistory": [],
  "speakingHistory": [],
  "conversationHistory": [],
  "debateHistory": [],
  "customScenarios": []
}
```
