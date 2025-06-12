// ===== РАСШИРЕННЫЙ ПОИСКОВЫЙ ФУНКЦИОНАЛ =====

class EnhancedSearchEngine {
    constructor() {
        this.searchData = this.buildSearchDatabase();
        this.searchHistory = this.loadSearchHistory();
        this.popularQueries = this.loadPopularQueries();
        this.initializeEnhancedSearch();
    }    // Построение базы данных для поиска
    buildSearchDatabase() {
        return {
            // Путь абитуриента
            admission: [
                {
                    id: 'admission',
                    title: 'Поступление в университет',
                    description: 'Общая информация о поступлении в РГАУ-МСХА имени К.А. Тимирязева.',
                    keywords: ['поступление', 'абитуриент', 'приём', 'университет', 'вуз'],
                    category: 'Поступление',
                    url: 'admission.html',
                    importance: 10
                },
                {
                    id: 'document-submission',
                    title: 'Подача документов (июнь-июль)',
                    description: 'Как и куда подавать документы для поступления. Список необходимых документов, способы подачи, приоритеты.',
                    keywords: ['документы', 'подача', 'поступление', 'заявление', 'аттестат', 'медсправка'],
                    category: 'Поступление',
                    url: 'document-submission.html',
                    importance: 10
                },
                {
                    id: 'competitive-selection',
                    title: 'Конкурсный отбор (конец июля)',
                    description: 'Отслеживание конкурсных списков, понимание приоритетов, проходные баллы.',
                    keywords: ['конкурс', 'списки', 'баллы', 'проходной', 'приоритет', 'отбор'],
                    category: 'Поступление',
                    url: 'competitive-selection.html',
                    importance: 10
                },
                {
                    id: 'enrollment',
                    title: 'Зачисление (август)',
                    description: 'Процедура зачисления, подача оригиналов документов, согласие на зачисление.',
                    keywords: ['зачисление', 'оригиналы', 'согласие', 'приказ', 'август'],
                    category: 'Поступление',
                    url: 'enrollment.html',
                    importance: 9
                },
                {
                    id: 'dormitory-settlement',
                    title: 'Заселение в общежитие (конец августа)',
                    description: 'Процесс заселения в общежитие, необходимые документы, что брать с собой.',
                    keywords: ['общежитие', 'заселение', 'документы', 'вещи', 'комната'],
                    category: 'Проживание',
                    url: 'dormitory-settlement.html',
                    importance: 9
                },
                {
                    id: 'adaptation',
                    title: 'Адаптация (сентябрь)',
                    description: 'Первые дни в университете, знакомство с одногруппниками, начало учебы.',
                    keywords: ['адаптация', 'учеба', 'группа', 'сентябрь', 'первокурсник'],
                    category: 'Поступление',
                    url: 'adaptation.html',
                    importance: 8
                }
            ],

            // Стипендии и льготы
            finances: [
                {
                    id: 'finances',
                    title: 'Финансы и стипендии',
                    description: 'Общая информация о финансовых вопросах и стипендиях в университете.',
                    keywords: ['финансы', 'деньги', 'стипендия', 'оплата', 'льготы'],
                    category: 'Финансы',
                    url: 'finances.html',
                    importance: 9
                },
                {
                    id: 'scholarships',
                    title: 'Стипендии и льготы',
                    description: 'Академическая стипендия, повышенная стипендия, социальные льготы.',
                    keywords: ['стипендия', 'деньги', 'льготы', 'баллы', 'успеваемость'],
                    category: 'Финансы',
                    url: 'scholarships.html',
                    importance: 9
                },
                {
                    id: 'moscow-card',
                    title: 'Карта москвича',
                    description: 'Льготная карта для студентов Москвы. Скидки на транспорт и услуги.',
                    keywords: ['карта', 'москвич', 'транспорт', 'скидки', 'льготы', 'метро'],
                    category: 'Финансы',
                    url: 'moscow-card.html',
                    importance: 8
                }
            ],

            // Проживание
            housing: [
                {
                    id: 'dormitory',
                    title: 'Общежитие и проживание',
                    description: 'Условия проживания в общежитии, правила, что можно и нельзя.',
                    keywords: ['общежитие', 'проживание', 'комната', 'блок', 'правила', 'техника'],
                    category: 'Проживание',
                    url: 'dormitory.html',
                    importance: 9
                },
                {
                    id: 'infrastructure',
                    title: 'Инфраструктура',
                    description: 'Магазины, спортзал, медицинские услуги, транспорт возле университета.',
                    keywords: ['магазины', 'спорт', 'поликлиника', 'транспорт', 'байкал', 'инфраструктура'],
                    category: 'Проживание',
                    url: 'infrastructure.html',
                    importance: 7
                },
                {
                    id: 'university-life',
                    title: 'Жизнь в университете',
                    description: 'Студенческая жизнь, мероприятия, организации и возможности.',
                    keywords: ['жизнь', 'студенты', 'мероприятия', 'организации', 'досуг'],
                    category: 'Проживание',
                    url: 'university-life.html',
                    importance: 8
                }
            ],

            // Военная подготовка
            military: [
                {
                    id: 'military',
                    title: 'Военная подготовка',
                    description: 'ВУЦ, военкомат, отсрочка от армии для студентов.',
                    keywords: ['армия', 'военкомат', 'отсрочка', 'вуц', 'военная', 'кафедра'],
                    category: 'Военная подготовка',
                    url: 'military.html',
                    importance: 8
                }
            ],

            // Поддержка
            support: [
                {
                    id: 'faq',
                    title: 'FAQ и поддержка',
                    description: 'Часто задаваемые вопросы, контакты авторов, дополнительная помощь.',
                    keywords: ['faq', 'вопросы', 'ответы', 'помощь', 'поддержка', 'контакты'],
                    category: 'Поддержка',
                    url: 'faq.html',
                    importance: 6
                }
            ]
        };
    }    // Инициализация улучшенного поиска
    initializeEnhancedSearch() {
        console.log('Enhanced Search: начало инициализации');
        
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        const searchContainer = document.querySelector('.search-container');
        
        console.log('Enhanced Search: элементы найдены', {
            searchInput: !!searchInput,
            searchBtn: !!searchBtn,
            searchContainer: !!searchContainer
        });
        
        if (!searchInput || !searchContainer) {
            console.warn('Enhanced Search: не найдены обязательные элементы');
            return;
        }

        // Создаем контейнер для автодополнения
        this.createAutocompleteContainer(searchContainer);
        
        // Создаем контейнер для фильтров
        this.createFiltersContainer(searchContainer);        // Обработчики событий
        searchInput.addEventListener('input', (e) => {
            console.log('Enhanced Search: input event', e.target.value);
            this.handleSearchInput(e);
        });
        searchInput.addEventListener('focus', () => {
            console.log('Enhanced Search: focus event');
            this.showSearchPanel();
        });
        searchInput.addEventListener('blur', (e) => this.hideSearchPanel(e));
        searchInput.addEventListener('keydown', (e) => this.handleKeyNavigation(e));
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query) {
                    // Если есть выбранный результат, переходим к нему
                    const selectedItem = document.querySelector('.search-result-item.focused');
                    if (selectedItem) {
                        const url = selectedItem.dataset.url;
                        if (e.ctrlKey || e.metaKey) {
                            window.open(url, '_blank');
                        } else {
                            window.location.href = url;
                        }
                        this.hideSearchPanel();
                    } else {
                        // Иначе открываем страницу результатов
                        this.openSearchResults(query);
                    }
                }
            }
        });
        
        // Обработчик кнопки поиска
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const query = searchInput.value.trim();
                console.log('Enhanced Search: button click', query);
                if (query) {
                    this.openSearchResults(query);
                }
            });
        }
        
        document.addEventListener('click', (e) => this.handleDocumentClick(e));
        
        console.log('Enhanced Search: инициализация завершена');
    }    // Создание контейнера автодополнения
    createAutocompleteContainer(searchContainer) {
        const autocompleteContainer = document.createElement('div');
        autocompleteContainer.className = 'search-autocomplete';
        autocompleteContainer.innerHTML = `
            <div class="search-panel">
                <div class="search-section">
                    <h4 class="search-section-title">Популярные запросы</h4>
                    <div class="popular-queries" id="popularQueries"></div>
                </div>
                
                <div class="search-section">
                    <h4 class="search-section-title">История поиска</h4>
                    <div class="search-history" id="searchHistory"></div>
                </div>
                
                <div class="search-section">
                    <h4 class="search-section-title">Результаты</h4>
                    <div class="search-results" id="searchResults"></div>
                </div>
                
                <div class="search-help">
                    <span class="search-help-item">
                        <kbd>↑</kbd><kbd>↓</kbd> навигация
                    </span>
                    <span class="search-help-item">
                        <kbd>Enter</kbd> переход
                    </span>
                    <span class="search-help-item">
                        <kbd>Ctrl+Enter</kbd> новая вкладка
                    </span>
                    <span class="search-help-item">
                        <kbd>Esc</kbd> закрыть
                    </span>
                </div>
            </div>
        `;
        
        searchContainer.appendChild(autocompleteContainer);
        this.autocompleteContainer = autocompleteContainer;
        
        // Обновляем популярные запросы и историю
        this.updatePopularQueries();
        this.updateSearchHistory();
    }

    // Создание фильтров
    createFiltersContainer(searchContainer) {
        const filtersContainer = document.createElement('div');
        filtersContainer.className = 'search-filters';
        filtersContainer.innerHTML = `
            <div class="filter-tabs">
                <button class="filter-tab active" data-category="all">Все</button>
                <button class="filter-tab" data-category="Поступление">Поступление</button>
                <button class="filter-tab" data-category="Финансы">Деньги</button>
                <button class="filter-tab" data-category="Проживание">Проживание</button>
                <button class="filter-tab" data-category="Военная подготовка">Военная</button>
                <button class="filter-tab" data-category="Поддержка">Помощь</button>
            </div>
        `;
        
        this.autocompleteContainer.querySelector('.search-panel').prepend(filtersContainer);
        
        // Обработчики для фильтров
        filtersContainer.addEventListener('click', (e) => this.handleFilterClick(e));
    }    // Обработка ввода в поиск
    handleSearchInput(e) {
        const query = e.target.value.trim();
        console.log('Enhanced Search: handleSearchInput called with query:', query);
        
        if (query.length === 0) {
            this.showDefaultPanel();
            return;
        }

        if (query.length >= 2) {
            console.log('Enhanced Search: performing search for:', query);
            this.performSearch(query);
        }
    }

    // Выполнение поиска
    performSearch(query, category = 'all') {
        console.log('Enhanced Search: performSearch called', { query, category });
        const results = this.searchInDatabase(query, category);
        console.log('Enhanced Search: search results:', results);
        this.displaySearchResults(results, query);
        
        // Добавляем в историю если больше 2 символов
        if (query.length >= 3) {
            this.addToHistory(query);
            this.updatePopularQueries(query);
        }
    }

    // Поиск в базе данных
    searchInDatabase(query, category = 'all') {
        const allItems = this.flattenSearchData();
        const queryLower = query.toLowerCase();
        
        return allItems
            .filter(item => {
                // Фильтр по категории
                if (category !== 'all' && item.category !== category) {
                    return false;
                }
                
                // Поиск в заголовке, описании и ключевых словах
                return item.title.toLowerCase().includes(queryLower) ||
                       item.description.toLowerCase().includes(queryLower) ||
                       item.keywords.some(keyword => keyword.toLowerCase().includes(queryLower));
            })
            .map(item => ({
                ...item,
                relevance: this.calculateRelevance(item, queryLower)
            }))
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, 8); // Ограничиваем до 8 результатов
    }

    // Расчет релевантности
    calculateRelevance(item, query) {
        let score = 0;
        
        // Точное совпадение в заголовке
        if (item.title.toLowerCase().includes(query)) {
            score += item.importance * 2;
        }
        
        // Совпадение в описании
        if (item.description.toLowerCase().includes(query)) {
            score += item.importance;
        }
        
        // Совпадение в ключевых словах
        item.keywords.forEach(keyword => {
            if (keyword.toLowerCase().includes(query)) {
                score += item.importance * 1.5;
            }
        });
        
        return score;
    }

    // Получение всех элементов из базы данных
    flattenSearchData() {
        const allItems = [];
        Object.values(this.searchData).forEach(category => {
            allItems.push(...category);
        });
        return allItems;
    }

    // Отображение результатов поиска
    displaySearchResults(results, query) {
        const resultsContainer = document.getElementById('searchResults');
        
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <p>Ничего не найдено по запросу "${query}"</p>
                    <small>Попробуйте изменить запрос или выбрать другую категорию</small>
                </div>
            `;
            return;
        }        resultsContainer.innerHTML = results.map(result => `
            <div class="search-result-item" data-url="${result.url}" title="Клик для перехода, Ctrl+клик для новой вкладки">
                <div class="result-category">${result.category}</div>
                <h5 class="result-title">${this.highlightQuery(result.title, query)}</h5>
                <p class="result-description">${this.highlightQuery(result.description, query)}</p>
                <div class="result-footer">
                    <div class="result-keywords">
                        ${result.keywords.slice(0, 3).map(keyword => 
                            `<span class="keyword">${this.highlightQuery(keyword, query)}</span>`
                        ).join('')}
                    </div>
                    <div class="result-actions">
                        <span class="result-shortcut" title="Ctrl+клик для новой вкладки">
                            <i class="fas fa-external-link-alt"></i>
                        </span>
                    </div>
                </div>
            </div>
        `).join('');// Добавляем обработчики кликов
        resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const url = item.dataset.url;
                
                // Проверяем, был ли клик с зажатым Ctrl/Cmd (открыть в новой вкладке)
                if (e.ctrlKey || e.metaKey) {
                    window.open(url, '_blank');
                } else {
                    // Обычный переход
                    window.location.href = url;
                }
                this.hideSearchPanel();
            });
        });

        // Добавляем кнопку "Показать все результаты" если результатов много
        if (results.length >= 8) {
            const showAllBtn = document.createElement('div');
            showAllBtn.className = 'search-show-all';
            showAllBtn.innerHTML = `
                <button class="show-all-btn">
                    <i class="fas fa-search-plus"></i>
                    Показать все результаты для "${query}"
                </button>
            `;
            resultsContainer.appendChild(showAllBtn);
            
            showAllBtn.addEventListener('click', () => {
                this.openSearchResults(query);
            });
        }
    }

    // Подсветка найденного текста
    highlightQuery(text, query) {
        if (!query || query.length < 2) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }    // Показ панели поиска
    showSearchPanel() {
        console.log('Enhanced Search: showing panel');
        if (this.autocompleteContainer) {
            this.autocompleteContainer.classList.add('active');
            this.autocompleteContainer.classList.add('show');
            document.body.classList.add('search-active');
        }
    }

    // Скрытие панели поиска
    hideSearchPanel(e) {
        console.log('Enhanced Search: hiding panel');
        // Задержка для обработки кликов по результатам
        setTimeout(() => {
            if (!e || !this.autocompleteContainer.contains(e.relatedTarget)) {
                if (this.autocompleteContainer) {
                    this.autocompleteContainer.classList.remove('active');
                    this.autocompleteContainer.classList.remove('show');
                    document.body.classList.remove('search-active');
                }
            }
        }, 150);
    }

    // Показ панели по умолчанию
    showDefaultPanel() {
        this.updatePopularQueries();
        this.updateSearchHistory();
        document.getElementById('searchResults').innerHTML = '';
    }

    // Обработка кликов по документу
    handleDocumentClick(e) {
        if (!this.autocompleteContainer.contains(e.target) && 
            !document.querySelector('.search-container').contains(e.target)) {
            this.hideSearchPanel();
        }
    }

    // Обработка кликов по фильтрам
    handleFilterClick(e) {
        if (!e.target.classList.contains('filter-tab')) return;
        
        // Переключение активного фильтра
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        e.target.classList.add('active');
        
        // Повторный поиск с новым фильтром
        const query = document.getElementById('searchInput').value.trim();
        const category = e.target.dataset.category;
        
        if (query.length >= 2) {
            this.performSearch(query, category);
        }
    }

    // Управление историей поиска
    addToHistory(query) {
        if (!query || query.length < 3) return;
        
        // Удаляем дубликаты и добавляем в начало
        this.searchHistory = [query, ...this.searchHistory.filter(h => h !== query)].slice(0, 10);
        this.saveSearchHistory();
        this.updateSearchHistory();
    }

    loadSearchHistory() {
        try {
            return JSON.parse(localStorage.getItem('searchHistory') || '[]');
        } catch {
            return [];
        }
    }

    saveSearchHistory() {
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    }

    updateSearchHistory() {
        const historyContainer = document.getElementById('searchHistory');
        
        if (this.searchHistory.length === 0) {
            historyContainer.innerHTML = '<p class="empty-state">История поиска пуста</p>';
            return;
        }

        historyContainer.innerHTML = this.searchHistory.map(query => `
            <div class="history-item" data-query="${query}">
                <span class="history-query">${query}</span>
                <button class="history-remove" data-query="${query}">×</button>
            </div>
        `).join('');        // Обработчики для истории
        historyContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('history-query') || e.target.classList.contains('history-item')) {
                const query = e.target.dataset.query || e.target.closest('.history-item').dataset.query;
                document.getElementById('searchInput').value = query;
                this.performSearch(query);
                
                // Если есть первый результат, можно сразу перейти к нему при двойном клике
                e.target.addEventListener('dblclick', () => {
                    const firstResult = document.querySelector('.search-result-item');
                    if (firstResult) {
                        const url = firstResult.dataset.url;
                        window.location.href = url;
                        this.hideSearchPanel();
                    }
                });
            } else if (e.target.classList.contains('history-remove')) {
                const query = e.target.dataset.query;
                this.removeFromHistory(query);
            }
        });
    }

    removeFromHistory(query) {
        this.searchHistory = this.searchHistory.filter(h => h !== query);
        this.saveSearchHistory();
        this.updateSearchHistory();
    }

    // Управление популярными запросами
    updatePopularQueries(newQuery = null) {
        if (newQuery) {
            const queries = this.loadPopularQueries();
            queries[newQuery] = (queries[newQuery] || 0) + 1;
            localStorage.setItem('popularQueries', JSON.stringify(queries));
            this.popularQueries = queries;
        }

        const popularContainer = document.getElementById('popularQueries');
        const topQueries = Object.entries(this.popularQueries)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 6)
            .map(([query]) => query);

        // Добавляем предустановленные популярные запросы если нет статистики
        const defaultQueries = ['стипендия', 'общежитие', 'документы', 'зачисление', 'военкомат'];
        const displayQueries = topQueries.length > 0 ? topQueries : defaultQueries;

        popularContainer.innerHTML = displayQueries.map(query => `
            <div class="popular-query" data-query="${query}">${query}</div>
        `).join('');        // Обработчики для популярных запросов
        popularContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('popular-query')) {
                const query = e.target.dataset.query;
                document.getElementById('searchInput').value = query;
                this.performSearch(query);
                
                // При двойном клике переходим к первому результату
                e.target.addEventListener('dblclick', () => {
                    const firstResult = document.querySelector('.search-result-item');
                    if (firstResult) {
                        const url = firstResult.dataset.url;
                        window.location.href = url;
                        this.hideSearchPanel();
                    }
                });
            }
        });
    }    loadPopularQueries() {
        try {
            return JSON.parse(localStorage.getItem('popularQueries') || '{}');
        } catch {
            return {};
        }
    }    /**
     * Открывает страницу результатов поиска
     * @param {string} query - Поисковый запрос
     * @param {string} category - Категория фильтра
     */
    openSearchResults(query, category = 'all') {
        if (!query.trim()) return;
        
        // Добавляем в историю
        this.addToHistory(query.trim());
        this.updatePopularQueries(query.trim());
        
        // Скрываем панель поиска
        this.hideSearchPanel();
        
        // Переходим на страницу результатов
        const searchParams = new URLSearchParams();
        searchParams.set('q', query.trim());
        if (category && category !== 'all') {
            searchParams.set('category', category);
        }
        
        // Определяем правильный путь к странице результатов
        const currentPath = window.location.pathname;
        let searchUrl;
        
        if (currentPath.includes('/pages/')) {
            // Мы уже в папке pages
            searchUrl = `search-results.html?${searchParams.toString()}`;
        } else if (currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath.endsWith('/website/')) {
            // Мы на главной странице
            searchUrl = `pages/search-results.html?${searchParams.toString()}`;
        } else {
            // Fallback - пытаемся определить по структуре URL
            const segments = currentPath.split('/');
            if (segments.includes('pages')) {
                searchUrl = `search-results.html?${searchParams.toString()}`;
            } else {
                searchUrl = `pages/search-results.html?${searchParams.toString()}`;
            }
        }
        
        window.location.href = searchUrl;
    }    /**
     * Выполняет поиск и возвращает результаты (для внешнего использования)
     * @param {string} query - Поисковый запрос
     * @param {string} category - Категория фильтра
     * @returns {Array} Результаты поиска
     */
    search(query, category = 'all') {
        return this.searchInDatabase(query, category);
    }

    /**
     * Обрабатывает навигацию с клавиатуры по результатам поиска
     * @param {KeyboardEvent} e - Событие клавиатуры
     */
    handleKeyNavigation(e) {
        const items = document.querySelectorAll('.search-result-item');
        if (items.length === 0) return;

        let currentIndex = -1;
        const currentFocused = document.querySelector('.search-result-item.focused');
        
        if (currentFocused) {
            currentIndex = Array.from(items).indexOf(currentFocused);
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                currentIndex = Math.min(currentIndex + 1, items.length - 1);
                this.focusSearchItem(items, currentIndex);
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                currentIndex = Math.max(currentIndex - 1, 0);
                this.focusSearchItem(items, currentIndex);
                break;
                
            case 'Escape':
                e.preventDefault();
                this.hideSearchPanel();
                document.getElementById('searchInput').blur();
                break;
        }
    }

    /**
     * Устанавливает фокус на элемент результата поиска
     * @param {NodeList} items - Список элементов
     * @param {number} index - Индекс элемента для фокуса
     */
    focusSearchItem(items, index) {
        // Убираем фокус со всех элементов
        items.forEach(item => item.classList.remove('focused'));
        
        // Устанавливаем фокус на нужный элемент
        if (items[index]) {
            items[index].classList.add('focused');
            
            // Прокручиваем к элементу если он вне видимости
            const container = document.querySelector('.search-content');
            const item = items[index];
            const containerRect = container.getBoundingClientRect();
            const itemRect = item.getBoundingClientRect();
            
            if (itemRect.bottom > containerRect.bottom) {
                container.scrollTop += itemRect.bottom - containerRect.bottom + 10;
            } else if (itemRect.top < containerRect.top) {
                container.scrollTop -= containerRect.top - itemRect.top + 10;
            }
        }
    }
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    window.enhancedSearchEngine = new EnhancedSearchEngine();
});
