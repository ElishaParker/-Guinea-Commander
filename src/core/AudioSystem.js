// -------------------- /src/core/AudioSystem.js --------------------

export default class AudioSystem {
  constructor() {
    this.ctx = null;
    this.sounds = {
      pellet: 512,
      pet: 432,
      convert: [432, 864],
      wave: [216, 432],
      gameover: [432, 216]
    };
    this.initialized = false;

    window.addEventListener('click', () => this.init(), { once: true });
    window.addEventListener('keydown', () => this.init(), { once: true });
  }

  init() {
    if (this.initialized) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.initialized = true;
  }

  play(freq, duration = 0.2) {
    if (!this.initialized) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.value = Array.isArray(freq) ? freq[0] : freq;
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }
}
