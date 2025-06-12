// dataService.js — сервис для работы с данными (пример для JSON)
export async function fetchData(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Ошибка загрузки данных');
  return await res.json();
}
