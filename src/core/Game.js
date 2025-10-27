// ==========================================
//  Guinea Commander - Core Game Module (v3.5)
//  Author: Elisha Blue Parker & Lennard AI
// ==========================================

// -------------------- /src/core/Game.js --------------------

// -------------------- /src/core/Game.js --------------------

import Input from './Input.js';
import AudioSystem from './AudioSystem.js';
import CollisionSystem from './CollisionSystem.js';
import Player from '../entities/Player.js';
import Guinea from '../entities/Guinea.js';



export default class Game {
  constructor(canvas, ctx, width, height, scale) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.scale = scale;

    // Systems
    this.input = new Input();
    this.audio = new AudioSystem();
    this.collision = new CollisionSystem();

    // State variables
    this.state = 'MENU';
    this.entities = [];
    this.walls = [];

    // Debug / timing
    this.debug = true;
    this.lastTime = 0;
    this.accumulator = 0;
    this.fixedDelta = 1 / 60;

    this.fps = 0;
    this.frames = 0;
    this.fpsTimer = 0;
    this.logs = [];
    this.maxLogs = 10;
    this.paused = false;

    this.lastSpace = false;
    this.lastClick = false;

    // Event listeners
    window.addEventListener('blur', () => this.pause());
    window.addEventListener('focus', () => this.resume());
    window.addEventListener('keydown', e => {
      if (e.key === 'F2') this.debug = !this.debug;
    });
  }

  start() {
  this.state = 'PLAYING';

  // arena walls
  this.walls = [
    { x: 0, y: 0, w: this.width, h: 16 },
    { x: 0, y: this.height - 16, w: this.width, h: 16 },
    { x: 0, y: 0, w: 16, h: this.height },
    { x: this.width - 16, y: 0, w: 16, h: this.height }
  ];

  // player in center
  this.player = new Player(this);
  this.entities.push(this.player);

  // guinea wave 1
  for (let i = 0; i < 5; i++) {
    const gx = 80 + Math.random() * (this.width - 160);
    const gy = 80 + Math.random() * (this.height - 160);
    const guinea = new Guinea(this, gx, gy, 80);
    this.entities.push(guinea);
  }

  console.log("Entities loaded:", this.entities.length);

  this.lastTime = performance.now();
  requestAnimationFrame(this.loop.bind(this));
}


  pause() {
    this.paused = true;
    this.accumulator = 0;
    this.log('Game paused (focus lost).');
  }

  resume() {
    this.paused = false;
    this.lastTime = performance.now();
    this.log('Game resumed (focus regained).');
  }

  log(msg) {
    this.logs.push(`[${new Date().toLocaleTimeString()}] ${msg}`);
    if (this.logs.length > this.maxLogs) this.logs.shift();
    if (window.DEBUG) console.log(msg);
  }

  fixedUpdate(dt) {
    this.entities.forEach(e => e.fixedUpdate?.(dt));
  }

update(dt) {
  for (const e of this.entities) {
    try {
      if (e && e.update) e.update(dt, this.input);
    } catch (err) {
      console.warn("Entity update error:", e, err);
    }
  }

  // Audio test triggers
  if (this.input.keys[' '] && !this.lastSpace) 
  {
    this.audio.play(this.audio.sounds.pellet);
  }
  if (this.input.mouse.pressed && !this.lastClick) {
    this.audio.play(this.audio.sounds.pet);
  }
  this.lastSpace = this.input.keys[' '];
  this.lastClick = this.input.mouse.pressed;
}


  // Simple audio triggers for test
  if (this.input.keys[' '] && !this.lastSpace) {
    this.audio.play(this.audio.sounds.pellet);
  }
  if (this.input.mouse.pressed && !this.lastClick) {
    this.audio.play(this.audio.sounds.pet);
  }
  this.lastSpace = this.input.keys[' '];
  this.lastClick = this.input.mouse.pressed;

  // Cleanup expired entities
  this.entities = this.entities.filter(e => !e.expired);
}



    // Audio test triggers
    if (this.input.keys[' '] && !this.lastSpace) {
      this.audio.play(this.audio.sounds.pellet);
    }
    if (this.input.mouse.pressed && !this.lastClick) {
      this.audio.play(this.audio.sounds.pet);
    }
    this.lastSpace = this.input.keys[' '];
    this.lastClick = this.input.mouse.pressed;
  }

draw() {
  const ctx = this.ctx;
  ctx.save();

  // Scale for pixel-perfect rendering
  ctx.scale(this.scale, this.scale);
  ctx.clearRect(0, 0, this.width, this.height);

  // Background
  ctx.fillStyle = '#202030';
  ctx.fillRect(0, 0, this.width, this.height);

  // Draw entities (player + guineas + projectiles)
  for (const e of this.entities) {
    if (e && e.draw) e.draw(ctx);
  }

  // Walls
  ctx.fillStyle = '#303048';
  for (const w of this.walls) ctx.fillRect(w.x, w.y, w.w, w.h);

  // Debug overlay
  if (this.debug) this.drawDebug(ctx);

  ctx.restore();
}


  drawDebug(ctx) {
    ctx.fillStyle = 'lime';
    ctx.font = '16px monospace';
    ctx.fillText(`FPS: ${this.fps.toFixed(1)}`, 10, 20);
    ctx.fillText(`Entities: ${this.entities.length}`, 10, 40);
    ctx.fillText(`State: ${this.state}`, 10, 60);
    ctx.fillText(`Engine ${window.ENGINE_VERSION}`, 10, 80);

    let logY = 120;
    ctx.fillStyle = 'yellow';
    for (const log of this.logs.slice(-5)) {
      ctx.fillText(log, 10, logY);
      logY += 20;
    }
  }

loop(now) {
  const delta = Math.min((now - this.lastTime) / 1000, 0.05);
  this.lastTime = now;

  if (this.paused) {
    this.accumulator = 0;
    requestAnimationFrame(this.loop.bind(this));
    return;
  }

  try {
    if (this.state === 'PLAYING') {
      this.accumulator += delta;
      while (this.accumulator >= this.fixedDelta) {
        this.fixedUpdate(this.fixedDelta);
        this.accumulator -= this.fixedDelta;
      }
      this.update(delta);
    }

    this.draw();

    this.frames++;
    this.fpsTimer += delta;
    if (this.fpsTimer >= 1) {
      this.fps = this.frames / this.fpsTimer;
      this.frames = 0;
      this.fpsTimer = 0;
    }
  } catch (err) {
    console.error("💥 Game loop error:", err);
    this.paused = true;
  }

  requestAnimationFrame(this.loop.bind(this));
}


    this.draw();

    this.frames++;
    this.fpsTimer += delta;
    if (this.fpsTimer >= 1) {
      this.fps = this.frames / this.fpsTimer;
      this.frames = 0;
      this.fpsTimer = 0;
    }

    requestAnimationFrame(this.loop.bind(this));
  }
}
