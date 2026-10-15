/**
 * Writing View Coordinator (Pillar I - PRO-05 High-Fidelity Integration)
 * Mounts 100% of DELF-DALF Lab Writing into #view-writing.
 */

export class WritingView {
  constructor({ container }) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.isInitialized = false;
  }

  render() {
    if (!this.container) return;
    if (this.isInitialized) return; // Prevent re-mounting and losing state

    this.container.innerHTML = `
      <div style="width: 100%; height: 100%; display: flex; flex-direction: column; overflow: hidden;">
        <iframe
          id="writing-module-frame"
          src="./src/modules/writing/standalone.html"
          style="width: 100%; height: 100%; border: none; background: transparent; flex: 1;"
          title="DELF-DALF Lab Writing Workspace"
        ></iframe>
      </div>
    `;

    this.isInitialized = true;
  }
}
