// ==========================================
//  Guinea Commander - Phase 7: Main Menu + Settings Screen (v3.5)
//  Author: Elisha Blue Parker & Lennard AI
// ==========================================

import { safeGet, safeSet } from '../utils/storage.js';

// -------------------- /src/ui/MainMenu.js --------------------

export class MainMenu {
  constructor(game) {
    this.game = game;
    this.options = ['Start Game', 'Leaderboard', 'Settings', 'Credits'];
    this.selected = 0;
    this.cooldown = 0;
    this.creditsY = 0;
    this.blinkTimer = 0;
  }

  start() {
    this.selected = 0;
    this.cooldown = 0;
    this.creditsY = 0;
    this.blinkTimer = 0;
    this.game.audio.play(this.game.audio.sounds.waveStart);
  }

  update(dt) {
    const input = this.game.input;
    this.cooldown -= dt;
    this.blinkTimer += dt;

    if (this.cooldown <= 0) {
      if (input.keys['ArrowUp'] || input.keys['w']) {
        this.selected = (this.selected - 1 + this.options.length) % this.options.length;
        this.cooldown = 0.2;
        this.game.audio.play(this.game.audio.sounds.pet);
      }
      if (input.keys['ArrowDown'] || input.keys['s']) {
        this.selected = (this.selected + 1) % this.options.length;
        this.cooldown = 0.2;
        this.game.audio.play(this.game.audio.sounds.pet);
      }
    }

    if (input.keys['Enter']) {
      this.activateOption();
      input.keys['Enter'] = false;
    }
  }

  activateOption() {
    const choice = this.options[this.selected];
    this.game.audio.play(this.game.audio.sounds.guineaConvert);

    switch (choice) {
      case 'Start Game':
        this.game.reset();
        this.game.state = 'PLAYING';
        break;
      case 'Leaderboard':
        this.game.state = 'GAMEOVER'; // reuse leaderboard display for now
        this.game.gameOverScreen.start();
        break;
      case 'Settings':
        this.game.settingsScreen.start();
        this.game.state = 'SETTINGS';
        break;
      case 'Credits':
        this.showCredits = true;
        break;
    }
  }

  draw(ctx) {
    const { width, height, scale } = this.game;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#FFD700';
    ctx.font = `${20 * scale}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText('GUINEA COMMANDER', width / 2, height / 2 - 120);

    ctx.font = `${10 * scale}px monospace`;
    for (let i = 0; i < this.options.length; i++) {
      const y = height / 2 - 40 + i * 30;
      ctx.fillStyle = i === this.selected ? '#00FFFF' : '#FFFFFF';
      ctx.fillText(this.options[i], width / 2, y);
    }

    const blink = Math.sin(this.blinkTimer * 3) > 0 ? '_' : '';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`Press ENTER to select${blink}`, width / 2, height / 2 + 110);

    ctx.font = `${8 * scale}px monospace`;
    ctx.fillStyle = '#888';
    ctx.textAlign = 'right';
    ctx.fillText(`v3.5  © Elisha Blue Parker + Lennard AI`, width - 10, height - 10);
  }
}
