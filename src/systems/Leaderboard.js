// -------------------- /src/systems/Leaderboard.js --------------------

import { safeGet, safeSet } from '../utils/storage.js';

export default class Leaderboard {
  constructor() {
    this.key = 'leaderboardData_v1';
    this.maxEntries = 10;
    this.entries = safeGet(this.key, []);
  }

  submitScore(player) {
    const newEntry = {
      name: player.name || 'Guest',
      score: player.score,
      wave: player.game.waveSystem?.waveNumber || 0,
      date: new Date().toISOString().split('T')[0]
    };

    this.entries.push(newEntry);
    this.entries.sort((a, b) => b.score - a.score);
    this.entries = this.entries.slice(0, this.maxEntries);

    safeSet(this.key, this.entries);
  }

  getTopScores() {
    return safeGet(this.key, []);
  }

  clear() {
    safeSet(this.key, []);
    this.entries = [];
  }
}
