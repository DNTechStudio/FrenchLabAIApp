/**
 * AudioStore: IndexedDB repository for storing and retrieving binary audio recording blobs
 */

const DB_NAME = 'delf_speaking_db';
const DB_VERSION = 1;
const STORE_NAME = 'audio_recordings';

export class AudioStore {
  constructor(customIndexedDB = (typeof window !== 'undefined' ? window.indexedDB : null)) {
    this.indexedDB = customIndexedDB;
    this.memoryFallback = new Map();
  }

  async openDB() {
    if (!this.indexedDB) return null;
    return new Promise((resolve, reject) => {
      const request = this.indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveAudioBlob(key, blob) {
    if (!this.indexedDB) {
      this.memoryFallback.set(key, blob);
      return key;
    }
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(blob, key);
        req.onsuccess = () => resolve(key);
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      this.memoryFallback.set(key, blob);
      return key;
    }
  }

  async getAudioBlob(key) {
    if (!this.indexedDB) {
      return this.memoryFallback.get(key) || null;
    }
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result || this.memoryFallback.get(key) || null);
        req.onerror = () => resolve(this.memoryFallback.get(key) || null);
      });
    } catch (e) {
      return this.memoryFallback.get(key) || null;
    }
  }

  async clearSessionAudio(prefix = '') {
    if (!this.indexedDB) {
      for (const k of this.memoryFallback.keys()) {
        if (k.startsWith(prefix)) this.memoryFallback.delete(k);
      }
      return;
    }
    try {
      const db = await this.openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.clear();
    } catch (e) {}
  }
}
