# Research & Architecture Decisions: 006 — Interactive French Dictation Mode

**Feature**: `006-french-dictation-mode`  
**Date**: 2026-09-25  

---

## 1. Audio Engine: Web Speech Synthesis API vs. Prerecorded Audio

### Decision: Browser-Native Web Speech Synthesis API (`window.speechSynthesis`)
- **Rationale**:
  1. **Zero External Dependency & Zero Cost**: Does not require any external third-party TTS service (ElevenLabs, Google Cloud TTS, or AWS Polly) or API keys.
  2. **100% Offline Capability**: Modern operating systems (Windows 11, macOS, iOS, Android, Linux) have built-in French voices (e.g., Microsoft Paul, Julie, Hortense, Google Français) that execute fully client-side without internet connectivity.
  3. **Dynamic Flexibility**: Can speak *any* text—including dynamically generated AI model essays from Feature 005 at all CEFR levels—without needing pre-rendered audio files.
  4. **Fine-Grained Playback Control**: Allows instant pause, resume, rate adjustment (`rate = 0.75` for deliberate dictation, `1.0` for natural tempo), and exact sentence replay.

### Implementation Pattern:
```typescript
function playFrenchUtterance(text: string, rate: number = 0.85): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      return reject(new Error('SpeechSynthesis not supported'));
    }
    window.speechSynthesis.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = rate;

    // Pick best available French voice
    const voices = window.speechSynthesis.getVoices();
    const frVoice = voices.find(v => v.lang === 'fr-FR' || v.lang.startsWith('fr'));
    if (frVoice) utterance.voice = frVoice;

    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);
    window.speechSynthesis.speak(utterance);
  });
}
```

---

## 2. French Sentence Segmentation (Tokenization)

### Problem:
In French administrative texts (DELF B2), periods (`.`) are used both for sentence boundaries and for common abbreviations:
- `M. le Maire` (Monsieur le Maire)
- `Mme.` (Madame)
- `etc.` (et cetera)
- `Mlle.` (Mademoiselle)
- `Dr.` (Docteur)

Naively splitting on `/[.!?]+/` incorrectly truncates sentences right after `M.`, leaving `" le Maire,"` as an orphan sentence.

### Solution:
A robust rule-based French sentence tokenizer using negative lookbehinds or abbreviation shielding:
```typescript
export function splitFrenchSentences(text: string): string[] {
  if (!text || !text.trim()) return [];

  // Protect common French abbreviations with unique tokens
  const protectedText = text
    .replace(/\bM\.\s+/g, 'M_DOT_SPACE_')
    .replace(/\bMme\.\s+/g, 'MME_DOT_SPACE_')
    .replace(/\bMlle\.\s+/g, 'MLLE_DOT_SPACE_')
    .replace(/\betc\.\s+/g, 'ETC_DOT_SPACE_');

  // Split on sentence-ending punctuation followed by whitespace or end of line
  const rawSentences = protectedText.split(/(?<=[.!?])\s+(?=[A-ZÀ-Ÿ0-9«"]|$)/);

  return rawSentences
    .map(s => s
      .replace(/M_DOT_SPACE_/g, 'M. ')
      .replace(/MME_DOT_SPACE_/g, 'Mme. ')
      .replace(/MLLE_DOT_SPACE_/g, 'Mlle. ')
      .replace(/ETC_DOT_SPACE_/g, 'etc. ')
      .trim()
    )
    .filter(s => s.length > 0);
}
```

---

## 3. French Linguistic Error Categorization

When a candidate makes a mistake in dictation, raw character diffs do not explain the pedagogical root cause. We classify discrepancies between the expected word ($W_{exp}$) and the candidate's typed word ($W_{user}$) into 4 categories:

### A. Accents & Diacritiques (Accents)
- **Condition**: $W_{exp}$ and $W_{user}$ are identical when stripped of accents (using Unicode normalization `NFD`).
- **Examples**:
  - `evenement` vs `événement`
  - `a` vs `à` (if context dictates accent)
  - `tache` vs `tâche`
  - `creer` vs `créer`

### B. Homophones Grammaticaux (Homophones)
- **Condition**: Words sound identical but belong to different grammatical classes, matching known French homophone clusters:
  - `c'est` / `s'est` / `ces` / `ses` / `sais` / `sait`
  - `a` / `à`
  - `ou` / `où`
  - `on` / `ont`
  - `son` / `sont`
  - `ce` / `se`
  - `leur` / `leurs`
  - `tout` / `tous`
  - `près` / `prêt`

### C. Accords & Morphosyntaxe (Grammar / Agreement)
- **Condition**: Discrepancy involves inflectional suffixes:
  - Plural markers: missing or extra `-s`, `-x` (*décision* vs *décisions*, *espace* vs *espaces*).
  - Feminine markers: missing or extra `-e` (*engagé* vs *engagée*, *pris* vs *prise*).
  - Verbal endings / Participle confusion: `-er` vs `-é` vs `-ée` vs `-és` vs `-ées` vs `-ez` (*participer* vs *participé*).
  - Third-person plural verb endings: `-ait` vs `-aient`, `-e` vs `-ent`.

### D. Lexique & Autre (Vocabulary / Typo / Omission)
- **Condition**: Complete word omission, insertion, or significant orthographic divergence.

---

## 4. Scoring Algorithm (Taux d'Exactitude)

To deliver clear exam benchmarking:
$$\text{Accuracy \%} = \max\left(0, \frac{\text{Total Reference Words} - \text{Mistakes Count}}{\text{Total Reference Words}}\right) \times 100$$
- If candidate achieves $\ge 90\%$: Excellent mastery (DELF B2 distinction).
- If candidate achieves $75–89\%$: Good B2 proficiency (passing score).
- If candidate achieves $< 75\%$: Recommended focus on identified mistake categories.
