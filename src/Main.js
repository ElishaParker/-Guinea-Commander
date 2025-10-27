// -------------------- /src/Main.js --------------------

export const ENGINE_VERSION = 'v0.1.0';
window.ENGINE_VERSION = ENGINE_VERSION;

import Game from './core/Game.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const LOGICAL_WIDTH = 1280;
const LOGICAL_HEIGHT = 720;
let scale = 1;

function resizeCanvas() {
  const aspect = LOGICAL_WIDTH / LOGICAL_HEIGHT;
  let w = window.innerWidth;
  let h = window.innerHeight;

  if (w / h > aspect) w = h * aspect;
  else h = w / aspect;

  canvas.width = LOGICAL_WIDTH;
  canvas.height = LOGICAL_HEIGHT;

  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  canvas.style.position = 'absolute';
  canvas.style.left = `${(window.innerWidth - w) / 2}px`;
  canvas.style.top = `${(window.innerHeight - h) / 2}px`;

  scale = w / LOGICAL_WIDTH;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const game = new Game(canvas, ctx, LOGICAL_WIDTH, LOGICAL_HEIGHT, 1);
game.start();
