
// -------------------- /src/Main.js --------------------

export const ENGINE_VERSION = 'v0.1.0';
window.ENGINE_VERSION = ENGINE_VERSION;

import Game from './core/Game.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
ctx.translate(0.5, 0.5);

let scale = 2;
const LOGICAL_WIDTH = 1920;
const LOGICAL_HEIGHT = 1080;

function resizeCanvas() {
  const aspect = LOGICAL_WIDTH / LOGICAL_HEIGHT;
  let w = window.innerWidth;
  let h = window.innerHeight;
  if (w / h > aspect) w = h * aspect; else h = w / aspect;
  scale = Math.floor(Math.max(1, Math.min(w / LOGICAL_WIDTH, h / LOGICAL_HEIGHT)));
  canvas.width = LOGICAL_WIDTH * scale;
  canvas.height = LOGICAL_HEIGHT * scale;
  canvas.style.width = `${LOGICAL_WIDTH * scale}px`;
  canvas.style.height = `${LOGICAL_HEIGHT * scale}px`;
  ctx.imageSmoothingEnabled = false;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Initialize and start game
const game = new Game(canvas, ctx, LOGICAL_WIDTH, LOGICAL_HEIGHT, scale);
game.start();
