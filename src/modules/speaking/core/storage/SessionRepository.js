/**
 * SessionRepository: Manages active exam session state in localStorage with crash recovery
 */

const ACTIVE_SESSION_KEY = 'delf_speaking_session_active';
const SESSION_HISTORY_KEY = 'delf_speaking_session_history';

export class SessionRepository {
  constructor(storage = (typeof window !== 'undefined' ? window.localStorage : null)) {
    this.storage = storage;
  }

  getActiveSession() {
    if (!this.storage) return null;
    try {
      const raw = this.storage.getItem(ACTIVE_SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error('Failed to parse active session from storage:', e);
      return null;
    }
  }

  saveActiveSession(session) {
    if (!this.storage || !session) return;
    try {
      session.updatedAt = Date.now();
      this.storage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to save active session to storage:', e);
    }
  }

  clearActiveSession() {
    if (!this.storage) return;
    try {
      this.storage.removeItem(ACTIVE_SESSION_KEY);
    } catch (e) {
      console.error('Failed to clear active session:', e);
    }
  }

  saveCompletedSessionToHistory(session) {
    if (!this.storage || !session) return;
    try {
      const history = this.listPastSessions();
      history.unshift({
        id: session.id,
        createdAt: session.createdAt || Date.now(),
        documentTitle: session.triggerDocument?.title || 'Document DELF B2',
        totalScore: session.evaluationReport?.totalScore || 0,
        isPassing: session.evaluationReport?.isPassing || false,
        summary: session.evaluationReport?.qualitativeSynthesis?.actionPlan?.[0] || ''
      });
      // Keep last 20 sessions
      this.storage.setItem(SESSION_HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
    } catch (e) {
      console.error('Failed to append to history:', e);
    }
  }

  listPastSessions() {
    if (!this.storage) return [];
    try {
      const raw = this.storage.getItem(SESSION_HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
}
