// -------------------- /src/entities/Guinea.js --------------------

export default class Guinea {
  constructor(game, x, y, speed = 100, waveNumber = 1) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.w = 12;
    this.h = 12;
    this.baseColor = '#FFAA55'; // wander color
    this.color = this.baseColor;

    this.vx = (Math.random() - 0.5) * speed;
    this.vy = (Math.random() - 0.5) * speed;
    this.speed = speed;
    this.directionTimer = 0;

    this.rewardCount = 0;
    this.converted = false;
    this.expired = false;

    this.lifeTimer = 10; // seconds until timeout
    this.follow = false;
  }

fixedUpdate(dt) {
  if (this.converted || this.expired) return;

 this.lifeTimer -= dt;
if (this.lifeTimer <= 0 && this.converted) {
    // instead of triggering timeout() instantly,
    // mark for removal next frame
    this.expired = true;
    this.pendingTimeout = true;
    return;
  }

  // Wander or follow behavior
  this.directionTimer -= dt;
  if (this.directionTimer <= 0) {
    this.vx = (Math.random() - 0.5) * this.speed;
    this.vy = (Math.random() - 0.5) * this.speed;
    this.directionTimer = 1 + Math.random();
  }

  if (this.follow && this.game.player) {
    const dx = this.game.player.x - this.x;
    const dy = this.game.player.y - this.y;
    const dist = Math.hypot(dx, dy);
    if (dist > 1) {
      this.vx = (dx / dist) * this.speed * 0.5;
      this.vy = (dy / dist) * this.speed * 0.5;
    }
  }

  this.x += this.vx * dt;
  this.y += this.vy * dt;
  this.game.collision.resolve(this, this.game.walls);

  // trigger timeout only once and safely, after motion
  if (this.pendingTimeout) {
    this.pendingTimeout = false;
    this.timeout();
  }
}

timeout() {
  if (this.expiredHandled) return;
  this.expiredHandled = true;
  this.color = '#888888';
  this.game.player.hp -= 10;
  this.game.player.score -= 10;
  if (this.game.audio?.sounds?.timeout) {
    this.game.audio.play(this.game.audio.sounds.timeout);
  }
}


    // Random wander behavior
    this.directionTimer -= dt;
    if (this.directionTimer <= 0) {
      this.vx = (Math.random() - 0.5) * this.speed;
      this.vy = (Math.random() - 0.5) * this.speed;
      this.directionTimer = 1 + Math.random();
    }

    // Follow player if partially fed
    if (this.follow && this.game.player) {
      const dx = this.game.player.x - this.x;
      const dy = this.game.player.y - this.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 1) {
        this.vx = (dx / dist) * this.speed * 0.5;
        this.vy = (dy / dist) * this.speed * 0.5;
      }
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    this.game.collision.resolve(this, this.game.walls);
  }

  update(dt) {
    if (this.converted || this.expired) return;

    // Check collisions with pellets and pets
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
    if (this.converted || this.expired) return;

    this.rewardCount++;
    this.game.player.score += 1;

    if (this.rewardCount === 1) {
      this.follow = true;
      this.color = '#FF77AA'; // trust pink
    }

    if (this.rewardCount >= 5) {
      this.convert();
    }
  }

  convert() {
    if (this.converted) return;
    this.converted = true;
    this.color = '#FFFF55';
    this.game.player.hp += 100;
    this.game.player.score += 100;
    this.game.player.army += 1;
    this.game.audio.play(this.game.audio.sounds.convert);
  }

  timeout() {
    if (this.expired) return;
    this.expired = true;
    this.color = '#888888';
    this.game.player.hp -= 10;
    this.game.player.score -= 10;
    this.game.audio.play(this.game.audio.sounds.timeout);
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
