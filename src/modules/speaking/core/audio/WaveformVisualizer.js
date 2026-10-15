/**
 * WaveformVisualizer: Renders real-time audio soundwave animation on HTML5 Canvas
 */

export class WaveformVisualizer {
  constructor(canvasElement, { barColor = '#3b82f6', activeGlow = '#60a5fa' } = {}) {
    this.canvas = canvasElement;
    this.ctx = canvasElement?.getContext('2d') || null;
    this.barColor = barColor;
    this.activeGlow = activeGlow;
    this.barCount = 36;
  }

  draw(dataArray) {
    if (!this.ctx || !this.canvas) return;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, width, height);

    if (!dataArray || dataArray.length === 0) {
      this.drawIdleState(width, height);
      return;
    }

    const step = Math.floor(dataArray.length / this.barCount);
    const barWidth = (width / this.barCount) * 0.65;
    const gap = (width / this.barCount) * 0.35;

    for (let i = 0; i < this.barCount; i++) {
      const value = dataArray[i * step] || 0;
      const percent = value / 255;
      const barHeight = Math.max(4, percent * height * 0.85);

      const x = i * (barWidth + gap) + gap / 2;
      const y = (height - barHeight) / 2;

      // Gradient styling
      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
      gradient.addColorStop(0, '#60a5fa');
      gradient.addColorStop(0.5, '#3b82f6');
      gradient.addColorStop(1, '#6366f1');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 3);
      ctx.fill();
    }
  }

  drawIdleState(width, height) {
    const ctx = this.ctx;
    const barWidth = (width / this.barCount) * 0.65;
    const gap = (width / this.barCount) * 0.35;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    for (let i = 0; i < this.barCount; i++) {
      const x = i * (barWidth + gap) + gap / 2;
      const barHeight = 4;
      const y = (height - barHeight) / 2;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 2);
      ctx.fill();
    }
  }
}
