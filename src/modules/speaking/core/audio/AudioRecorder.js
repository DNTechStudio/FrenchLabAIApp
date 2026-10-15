/**
 * AudioRecorder: Encapsulates MediaStream, MediaRecorder, and Web Audio AnalyserNode
 */

export class AudioRecorder {
  constructor({ onWaveformSample = null } = {}) {
    this.mediaRecorder = null;
    this.audioContext = null;
    this.analyser = null;
    this.sourceNode = null;
    this.mediaStream = null;
    this.audioChunks = [];
    this.isRecording = false;
    this.isPaused = false;
    this.startTime = 0;
    this.durationSeconds = 0;
    this.onWaveformSample = onWaveformSample;
    this.animationFrameId = null;
  }

  async startRecording() {
    this.audioChunks = [];
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContextClass();
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);
    this.sourceNode.connect(this.analyser);

    // Preferred MIME type
    let mimeType = 'audio/webm;codecs=opus';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else {
        mimeType = '';
      }
    }

    this.mediaRecorder = mimeType
      ? new MediaRecorder(this.mediaStream, { mimeType })
      : new MediaRecorder(this.mediaStream);

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        this.audioChunks.push(e.data);
      }
    };

    this.mediaRecorder.start(250); // Emit chunk every 250ms
    this.isRecording = true;
    this.isPaused = false;
    this.startTime = Date.now();

    this.startWaveformLoop();
  }

  startWaveformLoop() {
    if (!this.analyser) return;
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    const render = () => {
      if (!this.isRecording) return;
      if (!this.isPaused) {
        this.analyser.getByteFrequencyData(dataArray);
        if (this.onWaveformSample) {
          this.onWaveformSample(dataArray);
        }
      }
      this.animationFrameId = requestAnimationFrame(render);
    };

    render();
  }

  pauseRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
      this.isPaused = true;
    }
  }

  resumeRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
      this.isPaused = false;
    }
  }

  async stopRecording() {
    this.isRecording = false;
    this.isPaused = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        const fallbackBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.cleanup();
        resolve({
          blob: fallbackBlob,
          mimeType: 'audio/webm',
          durationSeconds: Math.round((Date.now() - this.startTime) / 1000)
        });
        return;
      }

      this.mediaRecorder.onstop = () => {
        const finalMime = this.mediaRecorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(this.audioChunks, { type: finalMime });
        const duration = Math.max(1, Math.round((Date.now() - this.startTime) / 1000));
        this.cleanup();
        resolve({
          blob: audioBlob,
          mimeType: finalMime,
          durationSeconds: duration
        });
      };

      this.mediaRecorder.stop();
    });
  }

  cleanup() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
  }
}
