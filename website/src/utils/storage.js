// storage.js — работа с localStorage
export function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
export function getFromStorage(key) {
  const val = localStorage.getItem(key);
  try {
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
}
export function removeFromStorage(key) {
  localStorage.removeItem(key);
}
