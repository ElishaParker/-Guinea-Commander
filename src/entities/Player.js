// -------------------- /src/entities/Player.js --------------------

import { safeGet, safeSet } from '../utils/storage.js';
import Pellet from './Pellet.js';
import Pet from './Pet.js';

export default class Player {
  constructor(game) {
    this.game = game;
    this.x = game.width / 2;
    this.y = game.height / 2;
    this.w = 16;
    this.h = 16;
    this.color = '#00FFFF';

    this.vx = 0;
    this.vy = 0;
    this.speed = 240; // px/s
    this.hp = 100;
    this.score = 0;
    this.army = 0;

    // Fire rate progression
    const baseFireRate = 5;
    const maxFireRate = 10;
    const storedRate = safeGet('fireRateUpgrade', baseFireRate);
    this.fireRate = Math.min(storedRate, maxFireRate);

    this.fireDelay = 1 / this.fireRate;
    this.fireTimer = 0;

    // Pet burst system
    this.petBurstLimit = 5;
    this.petCooldownTime = 1;
    this.petBurstCount = 0;
    this.petCooldown = 0;

    this.pellets = [];
    this.pets = [];
  }

  fixedUpdate(dt) {
    // Movement
    const input = this.game.input.keys;
    let ax = 0, ay = 0;
    if (input['w'] || input['arrowup']) ay -= 1;
    if (input['s'] || input['arrowdown']) ay += 1;
    if (input['a'] || input['arrowleft']) ax -= 1;
    if (input['d'] || input['arrowright']) ax += 1;

    const len = Math.hypot(ax, ay);
    if (len > 0) {
      ax /= len;
      ay /= len;
    }

    this.vx = ax * this.speed * dt;
    this.vy = ay * this.speed * dt;

    this.x += this.vx;
    this.y += this.vy;

    // Wall collision
    this.game.collision.resolve(this, this.game.walls);

    // Update pets and pellets physics
    for (const p of this.pellets) if (p.fixedUpdate) p.fixedUpdate(dt);
    for (const pet of this.pets) if (pet.fixedUpdate) pet.fixedUpdate(dt);

    // Cooldown timers
    if (this.petCooldown > 0) this.petCooldown -= dt;
    this.fireTimer -= dt;
  }

  update(dt) {
    const input = this.game.input;

    // Aim
    const rect = this.game.canvas.getBoundingClientRect();
    const mx = (input.mouse.x - rect.left) / this.game.scale;
    const my = (input.mouse.y - rect.top) / this.game.scale;
    this.facingAngle = Math.atan2(my - this.y, mx - this.x);

    // Pellet firing
    if (input.keys[' '] && this.fireTimer <= 0) {
      this.firePellet();
      this.fireTimer = this.fireDelay;
    }

    // Pet summon
    if (input.mouse.pressed && this.petCooldown <= 0) {
      this.summonPet();
      this.petBurstCount++;
      if (this.petBurstCount >= this.petBurstLimit) {
        this.petCooldown = this.petCooldownTime;
        this.petBurstCount = 0;
      }
    }

    // Update projectiles
    this.pellets = this.pellets.filter(p => !p.dead);
    this.pets = this.pets.filter(p => !p.dead);
    for (const p of this.pellets) if (p.update) p.update(dt);
    for (const pet of this.pets) if (pet.update) pet.update(dt);
  }

  firePellet() {
    const pellet = new Pellet(this.x + this.w / 2, this.y + this.h / 2, this.facingAngle);
    this.pellets.push(pellet);
    this.game.audio.play(this.game.audio.sounds.pellet);
  }

  summonPet() {
    const pet = new Pet(this.x, this.y, this.facingAngle);
    this.pets.push(pet);
    this.game.audio.play(this.game.audio.sounds.pet);
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);

    for (const p of this.pellets) if (p.draw) p.draw(ctx);
    for (const pet of this.pets) if (pet.draw) pet.draw(ctx);
  }
}
