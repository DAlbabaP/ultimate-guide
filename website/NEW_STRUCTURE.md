# Новая структура проекта (детализированная)

```
website/
└── src/
    ├── assets/
    │   ├── images/
    │   │   └── timiriazev-logo.svg
    │   ├── styles/
    │   │   ├── base.css
    │   │   ├── variables.css
    │   │   ├── responsive.css
    │   │   ├── style.css
    │   │   ├── dormitory.css
    │   │   ├── faq.css
    │   │   ├── infrastructure.css
    │   │   ├── military.css
    │   │   ├── moscow-card.css
    │   │   ├── scholarships.css
    │   │   └── pages/
    │   │       ├── adaptation.css
    │   │       ├── admission.css
    │   │       ├── competitive-selection.css
    │   │       ├── document-submission.css
    │   │       ├── dormitory-settlement.css
    │   │       ├── dormitory.css
    │   │       ├── enrollment.css
    │   │       ├── faq.css
    │   │       ├── finances.css
    │   │       ├── infrastructure.css
    │   │       ├── military.css
    │   │       ├── moscow-card.css
    │   │       ├── scholarships.css
    │   │       ├── search-results.css
    │   │       └── university-life.css
    │   └── fonts/
    ├── components/
    │   ├── common/
    │   │   ├── Header.html
    │   │   ├── Footer.html
    │   │   ├── Navigation.html
    │   │   ├── ThemeSwitcher.html
    │   │   └── SearchBar.html
    │   ├── ui/
    │   │   ├── Button.html
    │   │   ├── Card.html
    │   │   ├── Modal.html
    │   │   ├── Accordion.html
    │   │   ├── Carousel.html
    │   │   └── Tooltip.html
    │   └── forms/
    │       ├── SearchForm.html
    │       └── FeedbackForm.html
    ├── constants/
    │   ├── categories.js
    │   └── routes.js
    ├── data/
    │   └── (все существующие файлы из старой data/)
    ├── layouts/
    │   ├── MainLayout.html
    │   └── PageLayout.html
    ├── pages/
    │   ├── adaptation.html
    │   ├── admission.html
    │   ├── competitive-selection.html
    │   ├── document-submission.html
    │   ├── dormitory-settlement.html
    │   ├── dormitory.html
    │   ├── enrollment.html
    │   ├── faq.html
    │   ├── finances.html
    │   ├── infrastructure.html
    │   ├── military.html
    │   ├── moscow-card.html
    │   ├── scholarships.html
    │   ├── search-results.html
    │   └── university-life.html
    ├── services/
    │   └── dataService.js
    ├── utils/
    │   ├── search.js
    │   ├── dom.js
    │   └── storage.js
    ├── js/
    │   ├── data.js
    │   ├── enhanced-search.js
    │   ├── main.js
    │   ├── search-results.js
    │   ├── search.js
    │   └── widgets.js
    ├── index.html
    └── README.md
```

---

## Описание ключевых папок и файлов

- **assets/** — изображения, стили, шрифты
- **components/** — переиспользуемые части интерфейса (Header, Footer, UI-элементы, формы)
- **constants/** — константы, категории, маршруты
- **data/** — все данные и конфиги
- **layouts/** — шаблоны страниц
- **pages/** — все основные страницы сайта
- **services/** — работа с данными, API
- **utils/** — утилиты и хелперы
- **js/** — логика сайта (разбить по модулям)
- **index.html** — точка входа
- **README.md** — документация

---

> Все существующие файлы должны быть перенесены в новую структуру, пути импортов обновлены согласно новому расположению.
