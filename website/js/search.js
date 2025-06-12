// ===== ФУНКЦИОНАЛЬНОСТЬ ПОИСКА =====

const Search = {
  // Конфигурация поиска
  config: {
    minQueryLength: 2,
    maxResults: 10,
    suggestionsDelay: 300
  },

  // Элементы DOM
  elements: {
    form: null,
    input: null,
    button: null,
    clear: null,
    suggestions: null,
    results: null,
    filters: null,
    loading: null
  },

  // Данные
  searchIndex: [],
  currentQuery: '',
  selectedSuggestion: -1,

  // Инициализация
  init() {
    this.findElements();
    this.bindEvents();
    this.createSearchIndex();
    console.log('🔍 Поиск инициализирован');
  },

  // Поиск элементов в DOM
  findElements() {
    this.elements.form = document.querySelector('.search__form');
    this.elements.input = document.querySelector('.search__input');
    this.elements.button = document.querySelector('.search__button');
    this.elements.clear = document.querySelector('.search__clear');
    this.elements.suggestions = document.querySelector('.search__suggestions');
    this.elements.results = document.querySelector('.search__results');
    this.elements.filters = document.querySelectorAll('.search__filter');
    this.elements.loading = document.querySelector('.search__loading');
  },

  // Привязка событий
  bindEvents() {
    if (!this.elements.input) return;

    // Поиск по вводу
    this.elements.input.addEventListener('input', 
      App.utils.debounce((e) => {
        this.handleInput(e);
      }, this.config.suggestionsDelay)
    );

    // Обработка клавиш в поле поиска
    this.elements.input.addEventListener('keydown', (e) => {
      this.handleKeyDown(e);
    });

    // Отправка формы
    if (this.elements.form) {
      this.elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.performSearch();
      });
    }

    // Кнопка поиска
    if (this.elements.button) {
      this.elements.button.addEventListener('click', () => {
        this.performSearch();
      });
    }

    // Кнопка очистки
    if (this.elements.clear) {
      this.elements.clear.addEventListener('click', () => {
        this.clearSearch();
      });
    }

    // Фильтры
    this.elements.filters.forEach(filter => {
      filter.addEventListener('click', () => {
        this.toggleFilter(filter);
      });
    });

    // Закрытие подсказок при клике вне поля
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search')) {
        this.clearSuggestions();
      }
    });
  },

  // Обработка ввода
  handleInput(e) {
    const query = e.target.value.trim();
    this.currentQuery = query;

    if (query.length >= this.config.minQueryLength) {
      this.showSuggestions(query);
    } else {
      this.clearSuggestions();
    }

    // Показываем/скрываем кнопку очистки
    if (this.elements.clear) {
      this.elements.clear.style.display = query ? 'block' : 'none';
    }
  },

  // Обработка клавиш
  handleKeyDown(e) {
    const suggestions = document.querySelectorAll('.search__suggestion');
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.selectedSuggestion = Math.min(
          this.selectedSuggestion + 1, 
          suggestions.length - 1
        );
        this.updateSuggestionSelection();
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        this.selectedSuggestion = Math.max(this.selectedSuggestion - 1, -1);
        this.updateSuggestionSelection();
        break;
        
      case 'Enter':
        if (this.selectedSuggestion >= 0 && suggestions[this.selectedSuggestion]) {
          e.preventDefault();
          this.selectSuggestion(suggestions[this.selectedSuggestion]);
        }
        break;
        
      case 'Escape':
        this.clearSuggestions();
        this.elements.input.blur();
        break;
    }
  },

  // Показать подсказки
  showSuggestions(query) {
    if (!this.elements.suggestions) return;

    const suggestions = this.getSuggestions(query);
    
    if (suggestions.length === 0) {
      this.clearSuggestions();
      return;
    }

    const html = suggestions.map((suggestion, index) => `
      <div class="search__suggestion" data-index="${index}" data-url="${suggestion.url}">
        <div class="search__suggestion-text">${this.highlightText(suggestion.title, query)}</div>
        <div class="search__suggestion-category">${suggestion.category}</div>
      </div>
    `).join('');

    this.elements.suggestions.innerHTML = html;
    this.elements.suggestions.style.display = 'block';

    // Привязываем события к подсказкам
    this.elements.suggestions.querySelectorAll('.search__suggestion').forEach(item => {
      item.addEventListener('click', () => {
        this.selectSuggestion(item);
      });
    });

    this.selectedSuggestion = -1;
  },

  // Получить подсказки
  getSuggestions(query) {
    const normalizedQuery = query.toLowerCase();
    const suggestions = [];

    this.searchIndex.forEach(item => {
      const titleMatch = item.title.toLowerCase().includes(normalizedQuery);
      const contentMatch = item.content.toLowerCase().includes(normalizedQuery);
      
      if (titleMatch || contentMatch) {
        suggestions.push({
          title: item.title,
          category: item.category,
          url: item.url,
          relevance: titleMatch ? 2 : 1
        });
      }
    });

    // Сортируем по релевантности
    suggestions.sort((a, b) => b.relevance - a.relevance);
    
    return suggestions.slice(0, 5);
  },

  // Обновить выделение подсказки
  updateSuggestionSelection() {
    const suggestions = document.querySelectorAll('.search__suggestion');
    
    suggestions.forEach((item, index) => {
      if (index === this.selectedSuggestion) {
        item.classList.add('search__suggestion--active');
      } else {
        item.classList.remove('search__suggestion--active');
      }
    });
  },

  // Выбрать подсказку
  selectSuggestion(suggestionElement) {
    const url = suggestionElement.dataset.url;
    const text = suggestionElement.querySelector('.search__suggestion-text').textContent;
    
    this.elements.input.value = text;
    this.clearSuggestions();
    
    // Переходим на страницу
    if (url) {
      window.location.href = url;
    }
  },

  // Очистить подсказки
  clearSuggestions() {
    if (this.elements.suggestions) {
      this.elements.suggestions.style.display = 'none';
      this.elements.suggestions.innerHTML = '';
    }
    this.selectedSuggestion = -1;
  },

  // Выполнить поиск
  performSearch() {
    const query = this.elements.input.value.trim();
    
    if (query.length < this.config.minQueryLength) {
      return;
    }

    this.showLoading();
    this.clearSuggestions();

    // Имитируем задержку поиска
    setTimeout(() => {
      const results = this.searchContent(query);
      this.displayResults(results, query);
      this.hideLoading();
    }, 300);
  },

  // Поиск по контенту
  searchContent(query) {
    const normalizedQuery = query.toLowerCase();
    const results = [];

    this.searchIndex.forEach(item => {
      const titleMatch = item.title.toLowerCase().includes(normalizedQuery);
      const contentMatch = item.content.toLowerCase().includes(normalizedQuery);
      
      if (titleMatch || contentMatch) {
        let relevance = 0;
        let snippet = '';

        if (titleMatch) {
          relevance += 3;
        }
        
        if (contentMatch) {
          relevance += 1;
          // Создаем сниппет с контекстом
          snippet = this.createSnippet(item.content, normalizedQuery);
        }

        results.push({
          title: item.title,
          category: item.category,
          url: item.url,
          snippet: snippet,
          relevance: relevance
        });
      }
    });

    // Сортируем по релевантности
    results.sort((a, b) => b.relevance - a.relevance);
    
    return results.slice(0, this.config.maxResults);
  },

  // Создать сниппет с контекстом
  createSnippet(content, query, maxLength = 200) {
    const index = content.toLowerCase().indexOf(query);
    if (index === -1) return content.substring(0, maxLength) + '...';

    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + query.length + 50);
    
    let snippet = content.substring(start, end);
    
    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet = snippet + '...';
    
    return snippet;
  },

  // Отобразить результаты
  displayResults(results, query) {
    if (!this.elements.results) return;

    if (results.length === 0) {
      this.elements.results.innerHTML = `
        <div class="search__no-results">
          <h3>Ничего не найдено</h3>
          <p>Попробуйте изменить поисковый запрос или воспользуйтесь фильтрами.</p>
        </div>
      `;
      return;
    }

    const html = results.map(result => `
      <div class="search__result">
        <div class="search__result-category">${result.category}</div>
        <h3 class="search__result-title">
          <a href="${result.url}">${this.highlightText(result.title, query)}</a>
        </h3>
        <div class="search__result-snippet">
          ${this.highlightText(result.snippet, query)}
        </div>
      </div>
    `).join('');

    this.elements.results.innerHTML = html;
  },

  // Подсветка текста
  highlightText(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="search__result-highlight">$1</span>');
  },

  // Переключить фильтр
  toggleFilter(filterElement) {
    filterElement.classList.toggle('search__filter--active');
    
    // Если есть активный поиск, повторяем его с новыми фильтрами
    if (this.currentQuery) {
      this.performSearch();
    }
  },

  // Получить активные фильтры
  getActiveFilters() {
    return Array.from(this.elements.filters)
      .filter(filter => filter.classList.contains('search__filter--active'))
      .map(filter => filter.dataset.category);
  },

  // Очистить поиск
  clearSearch() {
    this.elements.input.value = '';
    this.currentQuery = '';
    this.clearSuggestions();
    
    if (this.elements.results) {
      this.elements.results.innerHTML = '';
    }
    
    if (this.elements.clear) {
      this.elements.clear.style.display = 'none';
    }
  },

  // Показать индикатор загрузки
  showLoading() {
    if (this.elements.loading) {
      this.elements.loading.style.display = 'flex';
    }
  },

  // Скрыть индикатор загрузки
  hideLoading() {
    if (this.elements.loading) {
      this.elements.loading.style.display = 'none';
    }
  },

  // Создать поисковый индекс
  createSearchIndex() {
    // Базовый индекс с основными страницами
    this.searchIndex = [
      {
        title: 'Подача документов',
        category: 'Поступление',
        url: './pages/applicant-path/documents.html',
        content: 'Документы для поступления паспорт аттестат СНИЛС заявление фотографии медицинская справка'
      },
      {
        title: 'Конкурсный отбор',
        category: 'Поступление', 
        url: './pages/applicant-path/selection.html',
        content: 'Конкурсные списки приоритеты направления отбор абитуриентов баллы ЕГЭ'
      },
      {
        title: 'Зачисление',
        category: 'Поступление',
        url: './pages/applicant-path/enrollment.html',
        content: 'Зачисление приказы результаты передача документов договор обучение'
      },
      {
        title: 'Общежитие',
        category: 'Проживание',
        url: './pages/university-life/dormitory.html',
        content: 'Общежитие заселение проживание блочный тип комнаты правила что можно что нельзя'
      },
      {
        title: 'Стипендии',
        category: 'Финансы',
        url: './pages/scholarships/index.html',
        content: 'Стипендия академическая социальная повышенная баллы система поощрения студентов'
      }
    ];

    console.log(`📚 Создан поисковый индекс: ${this.searchIndex.length} записей`);
  },

  // Обновить индекс (для динамической загрузки контента)
  updateIndex(contentData) {
    if (contentData && contentData.pages) {
      this.searchIndex = contentData.pages.map(page => ({
        title: page.title,
        category: page.category,
        url: page.url,
        content: page.content || page.description || ''
      }));
      
      console.log(`📚 Обновлен поисковый индекс: ${this.searchIndex.length} записей`);
    }
  }
};

// Экспортируем для использования в других модулях
window.Search = Search;
