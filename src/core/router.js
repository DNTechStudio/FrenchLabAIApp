/**
 * Workspace Router for French Lab AI Super-App (TEC-2026-07 PRO-07)
 * Zero-reload Single Page Application switcher between the 4 core pillars.
 */

import { StorageManager } from './storage/storage.js';

export class WorkspaceRouter {
  constructor({ onNavigate }) {
    this.currentViewId = 'speaking';
    this.onNavigate = onNavigate;
    this.viewMap = {
      'speaking': 'view-speaking',
      'writing': 'view-writing',
      'dictation': 'view-dictation',
      'conversation': 'view-conversation',
      'debate': 'view-debate'
    };
  }

  init() {
    const prefs = StorageManager.getPreferences();
    const initialView = prefs.activeModule || 'speaking';
    this.navigate(initialView, false);
  }

  navigate(viewKey, saveState = true) {
    if (!this.viewMap[viewKey]) {
      viewKey = 'speaking';
    }

    this.currentViewId = viewKey;

    // Toggle active view in DOM
    Object.entries(this.viewMap).forEach(([key, elementId]) => {
      const el = document.getElementById(elementId);
      if (el) {
        if (key === viewKey) {
          el.classList.add('active');
          el.style.display = 'flex';
        } else {
          el.classList.remove('active');
          el.style.display = 'none';
        }
      }
    });

    if (saveState) {
      StorageManager.savePreferences({ activeModule: viewKey });
    }

    if (typeof this.onNavigate === 'function') {
      this.onNavigate(viewKey);
    }
  }

  getCurrentView() {
    return this.currentViewId;
  }
}
