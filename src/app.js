/**
 * French Lab AI Super-App (TEC-2026-07 PRO-07)
 * Main Application Orchestrator & Bootstrapper
 */

import { WorkspaceRouter } from './core/router.js';
import { SidebarView } from './ui/SidebarView.js';
import { SpeakingView } from './ui/SpeakingView.js';
import { WritingView } from './ui/WritingView.js';
import { DictationView } from './ui/DictationView.js';
import { ConversationView } from './ui/ConversationView.js';
import { DebateView } from './ui/DebateView.js';

export class FrenchLabApp {
  constructor() {
    this.router = null;
    this.sidebar = null;
    this.views = {};
  }

  init() {
    // 1. Initialize Views
    this.views.speaking = new SpeakingView({ container: '#view-speaking' });
    this.views.writing = new WritingView({ container: '#view-writing' });
    this.views.dictation = new DictationView({ container: '#view-dictation' });
    this.views.conversation = new ConversationView({ container: '#view-conversation' });
    this.views.debate = new DebateView({ container: '#view-debate' });

    // 2. Initialize Router
    this.router = new WorkspaceRouter({
      onNavigate: (viewKey) => this.handleNavigation(viewKey)
    });

    // 3. Initialize Sidebar
    this.sidebar = new SidebarView({
      container: '#app-sidebar',
      router: this.router
    });
    this.sidebar.render();

    // 4. Start Router
    this.router.init();
  }

  handleNavigation(viewKey) {
    if (this.sidebar) {
      this.sidebar.updateActiveItem(viewKey);
    }

    // Lazy render / activate the selected view
    switch (viewKey) {
      case 'speaking':
        this.views.speaking.render();
        break;
      case 'writing':
        this.views.writing.render();
        break;
      case 'dictation':
        this.views.dictation.render();
        break;
      case 'conversation':
        this.views.conversation.render();
        break;
      case 'debate':
        this.views.debate.render();
        break;
    }
  }
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new FrenchLabApp();
  app.init();
  window.frenchLabApp = app;
});
