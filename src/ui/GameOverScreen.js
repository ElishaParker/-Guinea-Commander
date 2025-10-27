// -------------------- /src/ui/GameOverScreen.js --------------------

import Leaderboard from '../systems/Leaderboard.js';

export default class GameOverScreen {
  constructor(game) {
    this.game = game;
    this.leaderboard = new Leaderboard();
    this.nameInput = '';
    this.inputActive = false;
    this.submitted = false;
  }

  start() {
    this.inputActive = true;
    this.submitted = false;
    this.nameInput = '';
    this.game.audio.play(this.game.audio.sounds.gameOver);
  }

  update(dt) {
    const input = this.game.input;

    // simple key entry
    if (this.inputActive && !this.submitted) {
      for (const key in input.keys) {
        if (key.length === 1 && input.keys[key]) {
          if (this.nameInput.length < 30) this.nameInput += key;
          input.keys[key] = false; // prevent repeat
        }
      }
      // Backspace handling
      if (input.keys['backspace']) {
        this.nameInput = this.nameInput.slice(0, -1);
        input.keys['backspace'] = false;
      }
      // Enter to submit
      if (input.keys['enter']) {
        this.submit();
        input.keys['enter'] = false;
      }
    }
  }

  submit() {
    this.inputActive = false;
    this.submitted = true;
    this.game.player.name = this.nameInput.trim() || 'Guest';
    this.leaderboard.submitScore(this.game.player);
  }

  draw(ctx) {
    const { width, height, player } = this.game;
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `${14 * this.game.scale}px monospace`;
    ctx.textAlign = 'center';

    ctx.fillText('GAME OVER', width / 2, height / 2 - 100);
    ctx.font = `${10 * this.game.scale}px monospace`;
    ctx.fillText(`Score: ${player.score}`, width / 2, height / 2 - 70);
    ctx.fillText(`Waves: ${this.game.waveSystem.waveNumber}`, width / 2, height / 2 - 50);
    ctx.fillText(`Army: ${player.army}`, width / 2, height / 2 - 30);

    if (!this.submitted) {
      ctx.fillText('Enter Your Name:', width / 2, height / 2 + 10);
      ctx.fillText(this.nameInput || '_', width / 2, height / 2 + 30);
      ctx.fillText('(Press Enter to Submit)', width / 2, height / 2 + 60);
    } else {
      ctx.fillText('Top 10 Commanders', width / 2, height / 2 + 10);
      const entries = this.leaderboard.getTopScores();
      let y = height / 2 + 40;
      ctx.font = `${8 * this.game.scale}px monospace`;
      for (let i = 0; i < entries.length; i++) {
        const e = entries[i];
        const text = `${i + 1}. ${e.name.padEnd(10)}  ${e.score}  (W${e.wave})`;
        ctx.fillText(text, width / 2, y);
        y += 14;
      }
      ctx.fillText('(Press Space to Retry)', width / 2, y + 20);
    }

    ctx.textAlign = 'left';
  }

  handleRetry() {
    const input = this.game.input;
    if (this.submitted && input.keys[' ']) {
      this.game.reset();
      input.keys[' '] = false;
    }
  }
}
