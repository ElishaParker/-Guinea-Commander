// -------------------- /src/entities/Pellet.js --------------------

export default class Pellet {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.w = 4;
    this.h = 4;
    this.color = '#FFFF00';
    this.speed = 800;
    this.life = 2;
    this.dead = false;
    this.vx = Math.cos(angle) * this.speed;
    this.vy = Math.sin(angle) * this.speed;
  }

  fixedUpdate(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= dt;
    if (this.life <= 0) this.dead = true;
  }

  update() {}

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}
