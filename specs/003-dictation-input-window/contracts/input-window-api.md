# Interface Contracts: Sample Text Window & AI Generator (003-dictation-input-window)

## 1. Domain Service Contract: `AITextGenerator`

Module location: `src/core/dictation/aiTextGenerator.js`

### Methods

#### `generateText(options: { level: 'A1' | 'A2' | 'B1' | 'B2', category?: string }): AIGeneratorResult`
Generates a random French passage calibrated to the specified CEFR level.

- **Parameters**:
  - `level`: Target CEFR level (`A1`, `A2`, `B1`, `B2`).
  - `category`: Thematic category or empty/`'random'` for random selection.
- **Returns**: Object with `title`, `topic`, `level`, `category`, `fullText`, `grammarPoints`, `wordCount`, and `sentenceCount`.

#### `getRandomTopic(category?: string): { title: string, category: string, level: string }`
Returns a random discussion/dictation topic metadata.

#### `getCategories(): string[]`
Returns the list of supported thematic categories.

---

## 2. View Component Contract: `DictationView` Text Window Interface

Module location: `src/ui/DictationView.js`

### State Properties
- `isWindowEditing: boolean` - whether the text window is in in-place paste/edit mode.
- `windowEditText: string` - buffer text while editing.

### Methods
- `renderSampleTextWindow(): string` - Generates HTML markup for the Text Window placed directly below the top bar.
- `bindWindowEvents(): void` - Binds click/input events for level chips, paste toggle, AI generation, and random topic.
- `handleWindowLevelChange(level: string): void` - Switches active exercise to the selected CEFR level.
- `handleWindowAIGenerate(): void` - Generates a new calibrated passage and syncs the audio deck.
- `handleWindowRandomTopic(): void` - Generates a random topic across all categories and levels.
- `handleWindowPasteSubmit(text: string): void` - Parses and loads custom French text into active dictation.
