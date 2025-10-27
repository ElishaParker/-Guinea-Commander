// -------------------- /src/entities/Guinea.js --------------------
// Guinea Commander (v3.8) - Cohesive Herd Logic
// Author: Elisha Blue Parker & Lennard AI

export default class Guinea {
  constructor(game, x, y, speed = 100) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.w = 12;
    this.h = 12;
    this.baseColor = '#FFAA55';
    this.color = this.baseColor;

    this.vx = (Math.random() - 0.5) * speed;
    this.vy = (Math.random() - 0.5) * speed;
    this.speed = speed;
    this.directionTimer = 0;

    this.rewardCount = 0;
    this.converted = false;
    this.follow = false;
    this.isAlly = false;
  }

  fixedUpdate(dt) {
    // Random wander for unconverted
    if (!this.converted) {
      this.directionTimer -= dt;
      if (this.directionTimer <= 0) {
        this.vx = (Math.random() - 0.5) * this.speed;
        this.vy = (Math.random() - 0.5) * this.speed;
        this.directionTimer = 1 + Math.random();
      }
    }

    // Follower movement for converted allies
    if (this.follow && this.game.player) {
      const dx = this.game.player.x - this.x;
      const dy = this.game.player.y - this.y;
      const dist = Math.hypot(dx, dy);

      // maintain slight spacing around player
      const targetDist = 30 + Math.random() * 10;
      if (dist > targetDist) {
        this.vx = (dx / dist) * this.speed * 0.4;
        this.vy = (dy / dist) * this.speed * 0.4;
      } else {
        // gentle idle wiggle
        this.vx *= 0.8;
        this.vy *= 0.8;
      }

      // Separation from other allies
      for (const other of this.game.entities) {
        if (other !== this && other.isAlly) {
          const ox = this.x - other.x;
          const oy = this.y - other.y;
          const odist = Math.hypot(ox, oy);
          if (odist > 0 && odist < 20) {
            this.vx += (ox / odist) * 40 * dt;
            this.vy += (oy / odist) * 40 * dt;
          }
        }
      }
    }

    // Move and handle boundaries
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.game.collision.resolve(this, this.game.walls);
  }

  update(dt) {
    // Check pellets/pets for feeding
    if (this.converted) return;

    for (const pellet of this.game.player.pellets) {
      if (!pellet.dead && this.intersects(pellet)) {
        pellet.dead = true;
        this.feed();
      }
    }

    for (const pet of this.game.player.pets) {
      if (!pet.dead && this.intersects(pet)) {
        pet.dead = true;
        this.feed();
      }
    }
  }

  feed() {
    this.rewardCount++;
    this.game.player.score += 1;

    if (this.rewardCount === 1) {
      this.follow = true;
      this.color = '#FF77AA'; // trust pink
    }

    if (this.rewardCount >= 5) this.convert();
  }

  convert() {
    if (this.converted) return;
    this.converted = true;
    this.isAlly = true;
    this.follow = true;
    this.color = '#FFFF55'; // golden ally
    this.speed = 80;

    this.game.player.hp += 100;
    this.game.player.score += 100;
    this.game.player.army += 1;

    if (this.game.audio?.sounds?.convert) {
      this.game.audio.play(this.game.audio.sounds.convert);
    }
  }

  intersects(o) {
    return (
      this.x < o.x + o.w &&
      this.x + this.w > o.x &&
      this.y < o.y + o.h &&
      this.y + this.h > o.y
    );
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}
