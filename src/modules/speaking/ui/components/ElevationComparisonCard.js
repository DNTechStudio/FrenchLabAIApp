/**
 * ElevationComparisonCard: Comparative display of original speech alongside dual CEFR elevated versions
 * with Auditory Shadowing (TTS audio playback) and pedagogical explanations
 */

import { CEFR_LEVELS, CEFR_METADATA } from '../../core/practice/CefrLevelDefinitions.js';
import { i18n } from '../../core/i18n/I18nManager.js';
import { SpeechSpeedController } from './SpeechSpeedController.js';
import { getSavedSpeed } from '../../core/speech/voicePresets.js';

export function renderElevationComparisonCard({
  elevationResult,
  voiceSynthesizer,
  onRestart = () => {}
}) {
  const container = document.createElement('div');
  container.className = 'elevation-comparison-container';

  if (!elevationResult) {
    container.innerHTML = `<div class="glass-panel" style="text-align: center; color: var(--text-muted);">Aucun résultat d'élévation disponible.</div>`;
    return container;
  }

  const { originalTranscript, elevations, comparisonHighlights } = elevationResult;
  let { level1, level2 } = elevations;

  // Guarantee windows always appear in strictly ascending CEFR order (A1 -> A2 -> B1 -> B2 -> C1 -> C2)
  if (level2 && CEFR_LEVELS.indexOf(level2.level) < CEFR_LEVELS.indexOf(level1.level)) {
    const temp = level1;
    level1 = level2;
    level2 = temp;
  }

  const meta1 = CEFR_METADATA[level1.level] || { name: level1.level, ttsRate: 0.95 };
  const meta2 = level2 ? (CEFR_METADATA[level2.level] || { name: level2.level, ttsRate: 1.0 }) : null;

  container.innerHTML = `
    <!-- Top Action & Feedback Header -->
    <div class="glass-panel" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
      <div>
        <span class="badge badge-primary" style="margin-bottom: 0.35rem;">
          ✨ ${i18n.t('practice.elevation_badge') || 'Élévation Linguistique Multi-Niveaux'}
        </span>
        <h2 style="font-size: var(--text-xl); margin-bottom: 0.25rem;">
          ${i18n.t('practice.comparison_title') || 'Analyse & Amélioration IA'}
        </h2>
        <div style="font-size: var(--text-xs); color: var(--text-muted);">
          ${level2 
            ? `Comparaison active : <strong>Niveau ${level1.level}</strong> vs <strong>Niveau ${level2.level}</strong>` 
            : `Élévation active : <strong>Niveau ${level1.level}</strong> (Palier unique sélectionné)`}
        </div>
      </div>

      <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
        <div class="voice-selector-slot" style="display: flex; align-items: center; gap: 0.35rem; font-size: var(--text-xs); color: var(--text-muted);"></div>
        <button type="button" class="btn btn-secondary retry-practice-btn" style="padding: 0.5rem 1rem;">
          🔄 ${i18n.t('practice.clear_result') || 'Effacer les résultats'}
        </button>
      </div>
    </div>

    <!-- Comparative Grid (2 or 3 columns) -->
    <div class="elevation-grid">
      <!-- 1. Original Candidate Speech -->
      <div class="glass-panel elevation-column-card">
        <div class="elevation-header">
          <div>
            <span class="badge" style="background: ${elevationResult.isAiSuggested ? 'rgba(59, 130, 246, 0.2)' : 'rgba(100, 116, 139, 0.2)'}; color: ${elevationResult.isAiSuggested ? '#93c5fd' : '#94a3b8'}; font-size: var(--text-xs);">
              ${elevationResult.isAiSuggested ? '💡 Proposition IA' : 'Version Brute'}
            </span>
            <h3 style="font-size: var(--text-base); margin-top: 0.25rem;">
              ${elevationResult.isAiSuggested ? '🤖 Réponse Suggérée par l’IA' : '🗣️ Votre Prise de Parole'}
            </h3>
          </div>
          <span style="font-size: 0.75rem; color: var(--text-muted);">
            ${originalTranscript.split(/\s+/).length} mots
          </span>
        </div>

        <div class="elevation-text-content">
          ${escapeHtml(originalTranscript)}
        </div>

        <div style="font-size: var(--text-xs); color: var(--text-muted); line-height: 1.5;">
          ${elevationResult.isAiSuggested ? 'Intervention orale générée automatiquement par l’IA pour ce sujet.' : 'Transcription brute enregistrée par reconnaissance vocale.'}
        </div>
      </div>

      <!-- 2. Target Level 1 Elevation -->
      <div class="glass-panel elevation-column-card level-card-1">
        <div class="elevation-header">
          <div>
            <span class="badge badge-primary" style="font-size: var(--text-xs);">
              Palier ${level1.level} • ${meta1.name.split(' ')[0]}
            </span>
            <h3 style="font-size: var(--text-base); margin-top: 0.25rem; color: #93c5fd;">
              ${level1.level} : Version Adaptée
            </h3>
          </div>

          <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <div class="speed-slot-1"></div>
            <button type="button" class="btn btn-secondary tts-play-btn-1" style="padding: 0.35rem 0.75rem; font-size: var(--text-xs);" title="Écouter la prononciation et répéter (Shadowing)">
              🔊 Écouter
            </button>
          </div>
        </div>

        <div class="elevation-text-content">
          ${highlightKeywords(level1.rewrittenText, level1.connectorsUsed)}
        </div>

        <!-- Connectors Tag List -->
        <div style="margin-bottom: 0.75rem;">
          <div style="font-size: 0.7rem; font-weight: 700; color: #93c5fd; text-transform: uppercase; margin-bottom: 0.25rem;">
            Connecteurs intégrés :
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
            ${level1.connectorsUsed.map(c => `
              <span class="badge" style="background: rgba(59, 130, 246, 0.15); color: #93c5fd; font-size: 0.7rem;">
                + ${c}
              </span>
            `).join('')}
          </div>
        </div>

        <!-- Pedagogical Summary -->
        <div style="background: rgba(59, 130, 246, 0.08); border-left: 3px solid #3b82f6; padding: 0.65rem 0.85rem; border-radius: 4px; font-size: var(--text-xs); color: var(--text-secondary); line-height: 1.5;">
          ${level1.pedagogicalSummary}
        </div>
      </div>

      <!-- 3. Target Level 2 Elevation (Optional if selected) -->
      ${level2 ? `
        <div class="glass-panel elevation-column-card level-card-2">
          <div class="elevation-header">
            <div>
              <span class="badge" style="background: rgba(168, 85, 247, 0.2); color: #d8b4fe; border: 1px solid rgba(168, 85, 247, 0.4); font-size: var(--text-xs);">
                Palier ${level2.level} • ${meta2.name.split(' ')[0]}
              </span>
              <h3 style="font-size: var(--text-base); margin-top: 0.25rem; color: #d8b4fe;">
                ${level2.level} : Version Élevée
              </h3>
            </div>

            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <div class="speed-slot-2"></div>
              <button type="button" class="btn btn-secondary tts-play-btn-2" style="padding: 0.35rem 0.75rem; font-size: var(--text-xs);" title="Écouter la prononciation et répéter (Shadowing)">
                🔊 Écouter
              </button>
            </div>
          </div>

          <div class="elevation-text-content">
            ${highlightKeywords(level2.rewrittenText, level2.connectorsUsed)}
          </div>

          <!-- Connectors Tag List -->
          <div style="margin-bottom: 0.75rem;">
            <div style="font-size: 0.7rem; font-weight: 700; color: #d8b4fe; text-transform: uppercase; margin-bottom: 0.25rem;">
              Connecteurs & Tournures de haut niveau :
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
              ${level2.connectorsUsed.map(c => `
                <span class="badge" style="background: rgba(168, 85, 247, 0.15); color: #d8b4fe; font-size: 0.7rem;">
                  + ${c}
                </span>
              `).join('')}
            </div>
          </div>

          <!-- Pedagogical Summary -->
          <div style="background: rgba(168, 85, 247, 0.08); border-left: 3px solid #a855f7; padding: 0.65rem 0.85rem; border-radius: 4px; font-size: var(--text-xs); color: var(--text-secondary); line-height: 1.5;">
            ${level2.pedagogicalSummary}
          </div>
        </div>
      ` : ''}
    </div>

    <!-- Lexical Upgrades Highlight Section -->
    ${comparisonHighlights && comparisonHighlights.length > 0 ? `
      <div class="glass-panel" style="margin-top: 1.5rem;">
        <h3 style="font-size: var(--text-base); margin-bottom: 0.75rem; color: #fbbf24;">
          💡 Enrichissements Lexicaux et Stylistiques Détectés
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 0.75rem;">
          ${comparisonHighlights.map(h => `
            <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border-card); border-radius: var(--radius-sm); padding: 0.75rem;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.35rem;">
                <span style="font-size: 0.75rem; color: #fca5a5; text-decoration: line-through;">
                  « ${escapeHtml(h.fromSnippet)} »
                </span>
                <span class="badge badge-success" style="font-size: 0.65rem;">
                  Niveau ${h.targetLevel}
                </span>
              </div>
              <div style="font-size: var(--text-sm); font-weight: 700; color: #6ee7b7; margin-bottom: 0.25rem;">
                → « ${escapeHtml(h.toSnippet)} »
              </div>
              <div style="font-size: 0.7rem; color: var(--text-muted); line-height: 1.4;">
                ${escapeHtml(h.reason)}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `;

  // Mount Voice Timbre Selector if available
  const voiceSlot = container.querySelector('.voice-selector-slot');
  if (voiceSlot && voiceSynthesizer && typeof voiceSynthesizer.getAvailableFrenchVoices === 'function') {
    const frenchVoices = voiceSynthesizer.getAvailableFrenchVoices();
    if (frenchVoices.length > 0) {
      voiceSlot.innerHTML = `
        <span>🗣️ ${i18n.t('practice.voice_label') || 'Voix IA'} :</span>
        <select class="voice-select-box" aria-label="Choix de la voix IA">
          ${frenchVoices.map(v => {
            const isSelected = voiceSynthesizer.frenchVoice?.voiceURI === v.voiceURI;
            const isNatural = /natural|neural|google/i.test(v.name);
            const cleanName = v.name.replace(/microsoft|google|french|france|\(.*?\)/gi, '').trim() || v.name;
            return `
              <option value="${escapeHtml(v.voiceURI)}" ${isSelected ? 'selected' : ''}>
                ${isNatural ? '✨ ' : ''}${escapeHtml(cleanName)}
              </option>
            `;
          }).join('')}
        </select>
      `;

      voiceSlot.querySelector('.voice-select-box')?.addEventListener('change', (e) => {
        voiceSynthesizer.setVoiceURI(e.target.value);
      });
    }
  }

  // Mount Speed Controllers
  const savedSpeed = getSavedSpeed(1.0);
  let speedController2 = null;

  const speedController1 = new SpeechSpeedController({
    currentSpeed: savedSpeed,
    onSpeedChange: (speed) => {
      if (speedController2 && speedController2.getSpeed() !== speed) {
        speedController2.setSpeed(speed);
      }
    }
  });
  container.querySelector('.speed-slot-1')?.appendChild(speedController1.render());

  if (level2) {
    speedController2 = new SpeechSpeedController({
      currentSpeed: savedSpeed,
      onSpeedChange: (speed) => {
        if (speedController1 && speedController1.getSpeed() !== speed) {
          speedController1.setSpeed(speed);
        }
      }
    });
    container.querySelector('.speed-slot-2')?.appendChild(speedController2.render());
  }

  // Bind TTS Shadowing Audio buttons with dynamic speed resolution
  setupTtsButton(container.querySelector('.tts-play-btn-1'), level1.rewrittenText, () => speedController1.getSpeed(), voiceSynthesizer);
  if (level2) {
    setupTtsButton(container.querySelector('.tts-play-btn-2'), level2.rewrittenText, () => (speedController2 ? speedController2.getSpeed() : speedController1.getSpeed()), voiceSynthesizer);
  }

  // Bind Retry Button
  container.querySelector('.retry-practice-btn')?.addEventListener('click', () => {
    if (voiceSynthesizer) voiceSynthesizer.stop?.();
    onRestart();
  });

  return container;
}

function setupTtsButton(btn, text, rateProvider, synthesizer) {
  if (!btn || !synthesizer) return;

  let isPlaying = false;

  const resetBtn = () => {
    isPlaying = false;
    btn.textContent = '🔊 Écouter';
    btn.classList.remove('btn-danger');
    btn.classList.add('btn-secondary');
  };

  btn.addEventListener('click', () => {
    if (isPlaying) {
      if (typeof synthesizer.stop === 'function') synthesizer.stop();
      else if (typeof synthesizer.cancel === 'function') synthesizer.cancel();
      resetBtn();
    } else {
      if (typeof synthesizer.stop === 'function') synthesizer.stop();
      else if (typeof synthesizer.cancel === 'function') synthesizer.cancel();
      isPlaying = true;
      btn.textContent = '⏹️ Arrêter';
      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-danger');

      const rate = typeof rateProvider === 'function' ? rateProvider() : (rateProvider || 1.0);

      synthesizer.speak(text, {
        rate,
        onEnd: () => {
          resetBtn();
        },
        onError: () => {
          resetBtn();
        }
      });
    }
  });
}

function highlightKeywords(text, keywords = []) {
  let escaped = escapeHtml(text);
  keywords.forEach(kw => {
    const cleanKw = kw.replace(/\s*\(\+.*?\)\s*/g, '').trim();
    if (cleanKw.length > 2) {
      const regex = new RegExp(`\\b(${escapeRegex(cleanKw)})\\b`, 'gi');
      escaped = escaped.replace(regex, '<mark>$1</mark>');
    }
  });
  return escaped;
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
