// -------------------- /src/core/CollisionSystem.js --------------------

export default class CollisionSystem {
  check(a, b) {
    return (
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y
    );
  }

  resolve(entity, walls) {
    entity.vx = entity.vx || 0;
    entity.vy = entity.vy || 0;
    for (const w of walls) {
      if (this.check(entity, w)) {
        if (entity.vx > 0) entity.x = w.x - entity.w;
        if (entity.vx < 0) entity.x = w.x + w.w;
        if (entity.vy > 0) entity.y = w.y - entity.h;
        if (entity.vy < 0) entity.y = w.y + w.h;
      }
    }
  }
}
