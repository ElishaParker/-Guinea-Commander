// -------------------- /src/fx/TextPopup.js --------------------

export default class TextPopup {
  constructor(x, y, value) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.life = 1.0;
    this.dead = false;
  }

  fixedUpdate(dt) {
    this.y -= 20 * dt;
    this.life -= dt;
    if (this.life <= 0) this.dead = true;
  }

  draw(ctx) {
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.fillStyle = this.value.startsWith('-') ? '#FF6666' : '#66FF66';
    ctx.font = `${8 * 2}px monospace`;
    ctx.fillText(this.value, this.x, this.y);
    ctx.globalAlpha = 1;
  }
