// -------------------- /src/ui/HUD.js --------------------

export default class HUD {
  constructor(game) {
    this.game = game;
    this.UI_MARGIN = 20 / this.game.scale; // Safe zone padding
    this.flashTimer = 0; // For wave banners
  }

  update(dt) {
    if (this.flashTimer > 0) this.flashTimer -= dt;
  }

  draw(ctx) {
    const { player, waveSystem } = this.game;
    const margin = this.UI_MARGIN;

    // Health Bar
    const barWidth = 200;
    const barHeight = 12;
    const hpPercent = Math.max(0, player.hp / 100);
    let color = '#00FF00';
    if (hpPercent < 0.5) color = '#FFFF00';
    if (hpPercent < 0.25) color = '#FF0000';

    ctx.fillStyle = '#333';
    ctx.fillRect(margin, margin, barWidth, barHeight);
    ctx.fillStyle = color;
    ctx.fillRect(margin, margin, barWidth * Math.min(1, hpPercent), barHeight);

    // Score
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `${8 * this.game.scale}px monospace`;
    ctx.fillText(`Score: ${player.score.toString().padStart(6, '0')}`,
      this.game.width / 2 - 60, margin + 10);

    // Wave Counter
    ctx.fillText(`Wave: ${waveSystem.waveNumber}`, this.game.width - 100, margin + 10);

    // Army Count
    ctx.fillText(`Army: ${player.army}`, margin, this.game.height - margin);

    // Flash Banner for wave start / clear
    if (this.flashTimer > 0) {
      ctx.globalAlpha = this.flashTimer;
      ctx.fillStyle = '#FFFFAA';
      ctx.font = `${16 * this.game.scale}px monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(this.bannerText, this.game.width / 2, this.game.height / 2);
      ctx.textAlign = 'left';
      ctx.globalAlpha = 1;
    }
  }

  showBanner(text) {
    this.bannerText = text;
    this.flashTimer = 1.5; // 1.5 s fade
  }
}
