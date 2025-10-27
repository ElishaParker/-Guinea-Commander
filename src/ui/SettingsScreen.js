// -------------------- /src/ui/SettingsScreen.js --------------------

export class SettingsScreen {
  constructor(game) {
    this.game = game;
    this.options = ['Volume', 'Scale', 'Clear Leaderboard', 'Back'];
    this.selected = 0;
    this.cooldown = 0;
    this.settings = safeGet('settings_v1', { volume: 1.0, scale: 2 });
  }

  start() {
    this.selected = 0;
    this.cooldown = 0;
    this.game.audio.play(this.game.audio.sounds.waveStart);
  }

  update(dt) {
    const input = this.game.input;
    this.cooldown -= dt;

    if (this.cooldown <= 0) {
      if (input.keys['ArrowUp'] || input.keys['w']) {
        this.selected = (this.selected - 1 + this.options.length) % this.options.length;
        this.cooldown = 0.2;
      }
      if (input.keys['ArrowDown'] || input.keys['s']) {
        this.selected = (this.selected + 1) % this.options.length;
        this.cooldown = 0.2;
      }
    }

    if (input.keys['ArrowLeft'] || input.keys['a']) this.adjust(-1);
    if (input.keys['ArrowRight'] || input.keys['d']) this.adjust(1);

    if (input.keys['Enter']) {
      this.activateOption();
      input.keys['Enter'] = false;
    }

    if (input.keys['Escape']) {
      this.saveSettings();
      this.game.state = 'MENU';
      input.keys['Escape'] = false;
    }
  }

  adjust(direction) {
    const opt = this.options[this.selected];
    if (opt === 'Volume') {
      this.settings.volume = Math.min(1, Math.max(0, this.settings.volume + 0.1 * direction));
      this.game.audio.masterGain.gain.value = this.settings.volume;
    }
    if (opt === 'Scale') {
      this.settings.scale = Math.min(4, Math.max(2, this.settings.scale + direction));
      this.game.scale = this.settings.scale;
      this.game.resizeCanvas();
    }
  }

  activateOption() {
    const choice = this.options[this.selected];
    this.game.audio.play(this.game.audio.sounds.pet);

    if (choice === 'Clear Leaderboard') {
      safeSet('leaderboardData_v1', []);
    }
    if (choice === 'Back') {
      this.saveSettings();
      this.game.state = 'MENU';
    }
  }

  saveSettings() {
    safeSet('settings_v1', this.settings);
  }

  draw(ctx) {
    const { width, height, scale } = this.game;
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#FFD700';
    ctx.font = `${14 * scale}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText('SETTINGS', width / 2, height / 2 - 120);

    ctx.font = `${10 * scale}px monospace`;
    for (let i = 0; i < this.options.length; i++) {
      const y = height / 2 - 40 + i * 30;
      let label = this.options[i];
      if (label === 'Volume') label += `: ${(this.settings.volume * 100).toFixed(0)}%`;
      if (label === 'Scale') label += `: ×${this.settings.scale}`;
      ctx.fillStyle = i === this.selected ? '#00FFFF' : '#FFFFFF';
      ctx.fillText(label, width / 2, y);
    }

    ctx.font = `${8 * scale}px monospace`;
    ctx.fillStyle = '#888';
    ctx.textAlign = 'right';
    ctx.fillText('ESC to return', width - 10, height - 10);
  }
}
