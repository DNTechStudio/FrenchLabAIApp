/**
 * ExamTimer: Manages exam countdown (preparation) and elapsed (speaking) timers
 */

export class ExamTimer {
  constructor({ mode = 'countdown', initialSeconds = 600, onTick = null, onComplete = null } = {}) {
    this.mode = mode; // 'countdown' | 'elapsed'
    this.initialSeconds = initialSeconds;
    this.seconds = initialSeconds;
    this.isRunning = false;
    this.timerId = null;
    this.onTick = onTick;
    this.onComplete = onComplete;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.timerId = setInterval(() => {
      if (this.mode === 'countdown') {
        if (this.seconds > 0) {
          this.seconds--;
          if (this.onTick) this.onTick(this.seconds, this.getFormattedTime());
          if (this.seconds === 0) {
            this.stop();
            if (this.onComplete) this.onComplete();
          }
        }
      } else {
        this.seconds++;
        if (this.onTick) this.onTick(this.seconds, this.getFormattedTime());
      }
    }, 1000);
  }

  pause() {
    this.isRunning = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  resume() {
    this.start();
  }

  stop() {
    this.pause();
  }

  reset(newSeconds = this.initialSeconds) {
    this.pause();
    this.seconds = newSeconds;
    if (this.onTick) this.onTick(this.seconds, this.getFormattedTime());
  }

  adjustTime(deltaSeconds) {
    this.seconds = Math.max(0, this.seconds + deltaSeconds);
    if (this.onTick) this.onTick(this.seconds, this.getFormattedTime());
  }

  getFormattedTime() {
    const mins = Math.floor(this.seconds / 60);
    const secs = this.seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  /**
   * Evaluates the monologue speaking window status (for visual coloring)
   * Official target: 5 to 7 minutes (300s to 420s)
   */
  getMonologueStatus() {
    if (this.seconds < 180) {
      return { status: 'short', color: 'amber', label: 'Temps insuffisant (< 3 min)' };
    } else if (this.seconds < 300) {
      return { status: 'acceptable', color: 'blue', label: 'En dessous du créneau optimal (3-5 min)' };
    } else if (this.seconds <= 420) {
      return { status: 'optimal', color: 'green', label: 'Créneau recommandé officiel (5-7 min)' };
    } else if (this.seconds <= 480) {
      return { status: 'warning', color: 'amber', label: 'Attention au temps (> 7 min)' };
    } else {
      return { status: 'exceeded', color: 'red', label: 'Temps dépassé (> 8 min)' };
    }
  }
}
