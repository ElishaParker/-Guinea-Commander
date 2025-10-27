// ==========================================
//  Guinea Commander - Input System
//  Author: Elisha Blue Parker & Lennard AI
// ==========================================

// -------------------- /src/core/Input.js --------------------

export default class Input {
  constructor() {
    this.keys = {};
    this.mouse = { x: 0, y: 0, pressed: false };

    // Keyboard listeners
    window.addEventListener('keydown', e => (this.keys[e.key] = true));
    window.addEventListener('keyup', e => (this.keys[e.key] = false));

    // Mouse listeners
    window.addEventListener('mousedown', () => (this.mouse.pressed = true));
    window.addEventListener('mouseup', () => (this.mouse.pressed = false));
    window.addEventListener('mousemove', e => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  reset() {
    this.mouse.pressed = false;
  }
}
