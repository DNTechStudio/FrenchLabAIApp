/**
 * MicPermissionModal: Explains and guides candidate on microphone permissions
 */

export function showMicPermissionModal(errorMessage = '') {
  const existing = document.getElementById('mic-permission-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'mic-permission-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(8px);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  `;

  modal.innerHTML = `
    <div class="glass-panel" style="max-width: 520px; width: 100%; border-color: rgba(239, 68, 68, 0.4); box-shadow: 0 0 35px rgba(239, 68, 68, 0.25);">
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
        <div style="width: 44px; height: 44px; border-radius: var(--radius-lg); background: rgba(239, 68, 68, 0.2); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
          🎙️
        </div>
        <div>
          <h3 style="font-size: var(--text-lg); color: #fca5a5;">Autorisation Microphone Requise</h3>
          <p style="font-size: var(--text-xs); color: var(--text-muted);">L'épreuve orale DELF nécessite la captation de votre voix</p>
        </div>
      </div>

      <div style="font-size: var(--text-sm); line-height: 1.6; color: var(--text-secondary); margin-bottom: 1.25rem;">
        ${errorMessage ? `<div style="background: rgba(239, 68, 68, 0.1); padding: 0.5rem 0.75rem; border-radius: var(--radius-md); margin-bottom: 0.75rem; color: #fca5a5; font-size: var(--text-xs);">${errorMessage}</div>` : ''}
        Pour passer l'examen dans les conditions réelles :
        <ol style="margin-left: 1.25rem; margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
          <li>Cliquez sur l'icône de <strong>cadenas / paramètres</strong> à gauche de l'adresse URL du navigateur.</li>
          <li>Activez l'autorisation pour le <strong>Microphone</strong> (Autoriser / Allow).</li>
          <li>Rechargez la page ou cliquez sur le bouton Réessayer ci-dessous.</li>
        </ol>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
        <button class="btn btn-secondary close-modal-btn">Fermer</button>
        <button class="btn btn-primary retry-mic-btn">Réessayer la connexion</button>
      </div>
    </div>
  `;

  modal.querySelector('.close-modal-btn')?.addEventListener('click', () => modal.remove());
  modal.querySelector('.retry-mic-btn')?.addEventListener('click', async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      modal.remove();
      window.location.reload();
    } catch (e) {
      alert("L'accès au microphone est toujours bloqué. Veuillez vérifier les paramètres de votre navigateur.");
    }
  });

  document.body.appendChild(modal);
}
