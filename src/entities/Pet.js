// -------------------- /src/entities/Pet.js --------------------

export default class Pet {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.w = 8;
    this.h = 8;
    this.color = '#FF66CC';
    this.speed = 400;
    this.life = 0.4; // short lunge
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
