// -------------------- /src/utils/storage.js --------------------

export function safeSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch { console.warn('Storage unavailable'); }
}

export function safeGet(key, fallback = null) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; }
  catch { return fallback; }
}
