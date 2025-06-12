// dom.js — утилиты для работы с DOM
export function qs(selector, scope = document) {
  return scope.querySelector(selector);
}
export function qsa(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}
export function on(event, selector, handler, scope = document) {
  qsa(selector, scope).forEach(el => el.addEventListener(event, handler));
}
