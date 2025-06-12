# План миграции и карта изменений импортов

## 1. Пошаговый план перехода к новой структуре

1. Создать новую структуру папок внутри `website/src/` (assets, components, layouts, pages, utils, services, constants и т.д.)
2. Переместить файлы по новой структуре:
   - CSS → `assets/styles/`
   - JS → `js/` (позже — разбить по utils/services/components)
   - HTML-страницы → `pages/`
   - Изображения → `assets/images/`
   - Данные → `data/`
   - Компоненты (Header, Footer и др.) — выделить из страниц и вынести в `components/`
3. Создать шаблоны компонентов:
   - Вырезать повторяющиеся части (Header, Footer, Navigation, ThemeSwitcher, SearchBar) из всех страниц и вынести в отдельные файлы в `components/common/`
   - Аналогично для UI-элементов (Button, Card, Modal и др.) — в `components/ui/`
   - Формы — в `components/forms/`
4. Создать layouts:
   - `MainLayout.html` — основной шаблон с подключением Header, Footer, Navigation
   - `PageLayout.html` — для внутренних страниц
5. Обновить все импорты и подключения:
   - В HTML: пути к CSS, JS, изображениям, компонентам
   - В JS: относительные пути к модулям, утилитам, данным
6. Проверить работоспособность каждой страницы после перемещения.
7. Удалить старые папки/файлы после успешной миграции.

---

## 2. Карта изменений всех импортов (старый путь → новый путь)

| Старый путь                        | Новый путь                                      |
|------------------------------------|-------------------------------------------------|
| css/style.css                      | src/assets/styles/style.css                     |
| css/responsive.css                 | src/assets/styles/responsive.css                |
| css/dormitory.css                  | src/assets/styles/dormitory.css                 |
| css/faq.css                        | src/assets/styles/faq.css                       |
| ...                                | ...                                             |
| js/main.js                         | src/js/main.js (или src/components/common/Main.js) |
| js/enhanced-search.js              | src/js/enhanced-search.js (или src/utils/search.js) |
| js/widgets.js                      | src/js/widgets.js (или src/components/ui/Widgets.js) |
| img/timiriazev-logo.svg            | src/assets/images/timiriazev-logo.svg           |
| pages/admission.html               | src/pages/admission.html                        |
| ...                                | ...                                             |
| data/                              | src/data/                                       |
| components/                        | src/components/                                 |

**В HTML-файлах:**
- `<link rel="stylesheet" href="css/style.css">`  → `<link rel="stylesheet" href="src/assets/styles/style.css">`
- `<script src="js/main.js"></script>`  → `<script src="src/js/main.js"></script>`

---

## 3. Приоритеты изменений

1. Создание структуры и перемещение файлов.
2. Выделение и внедрение общих компонентов (Header, Footer, Navigation).
3. Обновление импортов и подключений.
4. Проверка работоспособности каждой страницы.
5. Оптимизация и удаление дубликатов.

---

## 4. Риски и способы их минимизации

- **Риск:** Потеря работоспособности из-за неправильных путей  
  **Решение:** После каждого перемещения — ручная проверка и чек-лист.
- **Риск:** Дублирование кода при выносе компонентов  
  **Решение:** Внимательно выносить только повторяющиеся части, не ломая уникальный контент страниц.
- **Риск:** Нарушение стилей из-за изменений путей  
  **Решение:** Проверять подключение всех CSS после каждого шага.

---

## 5. Чек-лист проверки импортов после каждого перемещения

- [ ] Все CSS-файлы подключаются корректно
- [ ] Все JS-файлы подключаются корректно
- [ ] Все изображения отображаются
- [ ] Все компоненты (Header, Footer и др.) подключены на всех страницах
- [ ] Нет ошибок в консоли браузера
- [ ] Все страницы открываются и работают как раньше

---

> После каждого этапа обязательно сверяйтесь с этим файлом и отмечайте выполненные пункты.
