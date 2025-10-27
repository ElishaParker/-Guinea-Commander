// -------------------- /src/systems/FXSystem.js --------------------

import Particle from '../fx/Particle.js';
import TextPopup from '../fx/TextPopup.js';

export default class FXSystem {
  constructor(game) {
    this.game = game;
    this.particles = [];
    this.texts = [];
  }

  emit(type, x, y, value = null) {
    if (type === 'heart') {
      for (let i = 0; i < 6; i++) {
        this.particles.push(new Particle(x, y, '#FF99AA'));
      }
    } else if (type === 'sparkle') {
      for (let i = 0; i < 8; i++) {
        this.particles.push(new Particle(x, y, '#FFFF99'));
      }
    } else if (type === 'popup' && value) {
      this.texts.push(new TextPopup(x, y, value));
    } else if (type === 'banner' && value) {
      this.game.hud.showBanner(value);
    }
  }

  fixedUpdate(dt) {
    for (const p of this.particles) p.fixedUpdate(dt);
    for (const t of this.texts) t.fixedUpdate(dt);

    this.particles = this.particles.filter(p => !p.dead);
    this.texts = this.texts.filter(t => !t.dead);
  }

  draw(ctx) {
    for (const p of this.particles) p.draw(ctx);
    for (const t of this.texts) t.draw(ctx);
  }
}
