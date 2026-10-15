/**
 * SpeechRecognizer: Encapsulates Web Speech Recognition API with French language model
 */

export class SpeechRecognizer {
  constructor({ onInterimResult = null, onFinalResult = null, onError = null } = {}) {
    const SpeechRecClass = (typeof window !== 'undefined')
      ? (window.SpeechRecognition || window.webkitSpeechRecognition)
      : null;

    this.isSupported = !!SpeechRecClass;
    this.recognition = SpeechRecClass ? new SpeechRecClass() : null;
    this.isListening = false;
    this.accumulatedTranscript = '';
    this.onInterimResult = onInterimResult;
    this.onFinalResult = onFinalResult;
    this.onError = onError;

    if (this.recognition) {
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'fr-FR';

      this.recognition.onresult = (event) => {
        let interimText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptChunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            this.accumulatedTranscript += (this.accumulatedTranscript ? ' ' : '') + transcriptChunk.trim();
            if (this.onFinalResult) this.onFinalResult(this.accumulatedTranscript);
          } else {
            interimText += transcriptChunk;
          }
        }
        if (this.onInterimResult && interimText) {
          this.onInterimResult(this.accumulatedTranscript + (this.accumulatedTranscript ? ' ' : '') + interimText);
        }
      };

      this.recognition.onerror = (event) => {
        if (this.onError) {
          this.onError(event.error);
        }
      };

      this.recognition.onend = () => {
        // Automatically restart if still intended to be listening
        if (this.isListening) {
          try {
            this.recognition.start();
          } catch (e) {}
        }
      };
    }
  }

  setLanguage(lang = 'fr-FR') {
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  startListening(initialText = '') {
    this.accumulatedTranscript = initialText;
    this.isListening = true;
    if (this.recognition) {
      try {
        this.recognition.start();
      } catch (e) {
        // Recognition might already be running
        console.warn('[SpeechRecognizer] startListening note:', e.message);
      }
    } else if (this.onError) {
      this.onError('not-supported');
    }
  }

  startContinuousRecognition(onFinal, onInterim, onError) {
    if (onFinal) this.onFinalResult = onFinal;
    if (onInterim) this.onInterimResult = onInterim;
    if (onError) this.onError = onError;
    this.startListening();
  }

  stopListening() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn('[SpeechRecognizer] stopListening note:', e.message);
      }
    }
    return this.accumulatedTranscript.trim();
  }

  stopContinuousRecognition() {
    return this.stopListening();
  }

  start(options = {}) {
    if (typeof options === 'object' && options !== null) {
      if (typeof options.onResult === 'function') {
        this.onInterimResult = (text) => options.onResult(text, false);
        this.onFinalResult = (text) => options.onResult(text, true);
      }
      if (typeof options.onError === 'function') {
        this.onError = options.onError;
      }
    }
    this.startListening(this.accumulatedTranscript);
  }

  stop() {
    return this.stopListening();
  }

  getTranscript() {
    return this.accumulatedTranscript.trim();
  }
}
