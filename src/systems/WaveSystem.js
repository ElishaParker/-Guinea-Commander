// -------------------- /src/systems/WaveSystem.js --------------------

import Guinea from '../entities/Guinea.js';
import { safeGet, safeSet } from '../utils/storage.js';

export default class WaveSystem {
  constructor(game) {
    this.game = game;
    this.waveNumber = 1;
    this.state = 'IDLE'; // IDLE, SPAWNING, ACTIVE, TRANSITION
    this.waveTimer = 0;
    this.guineas = [];
  }

  startWave(n) {
    this.waveNumber = n;
    this.state = 'SPAWNING';
    this.game.log(`Starting wave ${n}`, 'info');

    // Increase player fire rate persistently
    const storedRate = safeGet('fireRateUpgrade', 5);
    const newRate = Math.min(storedRate + 1, 10);
    safeSet('fireRateUpgrade', newRate);
    this.game.player.fireRate = newRate;
    this.game.player.fireDelay = 1 / newRate;

    this.spawnGuineas(n * 5);
    this.state = 'ACTIVE';
  }

  spawnGuineas(count) {
    const margin = 32;
    const speed = 100 * (1 + Math.floor(this.waveNumber / 3) * 0.05);

    for (let i = 0; i < count; i++) {
      const side = Math.floor(Math.random() * 4);
      let x, y;
      if (side === 0) { x = margin; y = Math.random() * this.game.height; }
      if (side === 1) { x = this.game.width - margin; y = Math.random() * this.game.height; }
      if (side === 2) { x = Math.random() * this.game.width; y = margin; }
      if (side === 3) { x = Math.random() * this.game.width; y = this.game.height - margin; }

      const guinea = new Guinea(this.game, x, y, speed, this.waveNumber);
      this.guineas.push(guinea);
    }

    this.game.audio.play(this.game.audio.sounds.waveStart);
  }

  fixedUpdate(dt) {
    if (this.state !== 'ACTIVE') return;

    for (const g of this.guineas) g.fixedUpdate(dt);

    // Remove converted or expired
    this.guineas = this.guineas.filter(g => !g.converted && !g.expired);

    if (this.guineas.length === 0) {
      this.endWave();
    }
  }

  update(dt) {
    if (this.state === 'TRANSITION') {
      this.waveTimer -= dt;
      if (this.waveTimer <= 0) this.startWave(this.waveNumber + 1);
    }
    if (this.state === 'ACTIVE') {
      for (const g of this.guineas) g.update(dt);
    }
  }

  endWave() {
    this.state = 'TRANSITION';
    this.waveTimer = 3; // 3-second countdown
    const bonus = 50 * this.waveNumber;
    this.game.player.score += bonus;
    this.game.log(`Wave ${this.waveNumber} cleared! +${bonus} pts`, 'info');
  }

  draw(ctx) {
    for (const g of this.guineas) g.draw(ctx);
  }
}
