// search.js — логика поиска (заготовка)
export function search(query, data) {
  if (!query) return [];
  const q = query.toLowerCase();
  return data.filter(item =>
    item.title.toLowerCase().includes(q) ||
    (item.content && item.content.toLowerCase().includes(q))
  );
}
