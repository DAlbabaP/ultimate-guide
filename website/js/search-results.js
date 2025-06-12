/**
 * Модуль управления страницей результатов поиска
 * Обрабатывает отображение результатов, фильтрацию, сортировку и пагинацию
 */

class SearchResultsPage {
    constructor() {
        this.currentPage = 1;
        this.resultsPerPage = 10;
        this.allResults = [];
        this.filteredResults = [];
        this.currentCategory = 'all';
        this.currentSort = 'relevance';
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadSearchFromURL();
    }
    
    bindEvents() {
        // Фильтры категорий
        const categoryFilters = document.getElementById('categoryFilters');
        if (categoryFilters) {
            categoryFilters.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-btn')) {
                    this.handleCategoryFilter(e.target);
                }
            });
        }
        
        // Сортировка
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.handleSort(e.target.value);
            });
        }
        
        // Пагинация
        const pagination = document.getElementById('pagination');
        if (pagination) {
            pagination.addEventListener('click', (e) => {
                e.preventDefault();
                if (e.target.classList.contains('pagination-number')) {
                    this.goToPage(parseInt(e.target.textContent));
                } else if (e.target.closest('.pagination-prev')) {
                    this.goToPage(this.currentPage - 1);
                } else if (e.target.closest('.pagination-next')) {
                    this.goToPage(this.currentPage + 1);
                }
            });
        }
    }
    
    /**
     * Загружает параметры поиска из URL
     */
    loadSearchFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        const category = urlParams.get('category');
        
        if (query) {
            this.performSearch(query, category || 'all');
        } else {
            this.showNoResults();
        }
    }
    
    /**
     * Выполняет поиск с заданным запросом
     * @param {string} query - Поисковый запрос
     * @param {string} category - Категория фильтра
     */
    async performSearch(query, category = 'all') {
        const startTime = performance.now();
        
        // Показываем загрузку
        this.showLoading();
        
        try {
            // Получаем результаты от enhanced search engine
            if (window.enhancedSearchEngine) {
                this.allResults = window.enhancedSearchEngine.search(query);
            } else {
                // Fallback если enhanced search не загружен
                this.allResults = this.fallbackSearch(query);
            }
            
            // Обновляем отображение
            this.updateSearchHeader(query, this.allResults.length, performance.now() - startTime);
            this.currentCategory = category;
            this.applyFilters();
            this.renderResults();
            
        } catch (error) {
            console.error('Ошибка поиска:', error);
            this.showError();
        }
    }
      /**
     * Резервный поиск если enhanced search недоступен
     * @param {string} query - Поисковый запрос
     * @returns {Array} Результаты поиска
     */
    fallbackSearch(query) {
        const searchData = [
            {
                title: 'Поступление в университет',
                description: 'Информация о поступлении, подаче документов и сроках приема.',
                url: 'admission.html',
                category: 'admission',
                score: 0.9
            },
            {
                title: 'Подача документов',
                description: 'Как и куда подавать документы для поступления. Список необходимых документов.',
                url: 'document-submission.html',
                category: 'admission',
                score: 0.95
            },
            {
                title: 'Конкурсный отбор',
                description: 'Отслеживание конкурсных списков, понимание приоритетов, проходные баллы.',
                url: 'competitive-selection.html',
                category: 'admission',
                score: 0.9
            },
            {
                title: 'Зачисление',
                description: 'Процедура зачисления, подача оригиналов документов, согласие на зачисление.',
                url: 'enrollment.html',
                category: 'admission',
                score: 0.85
            },
            {
                title: 'Стипендии и финансовая поддержка',
                description: 'Виды стипендий, льготы и финансовая помощь студентам.',
                url: 'scholarships.html',
                category: 'finance',
                score: 0.8
            },
            {
                title: 'Финансы',
                description: 'Общая информация о финансовых вопросах в университете.',
                url: 'finances.html',
                category: 'finance',
                score: 0.75
            },
            {
                title: 'Карта москвича',
                description: 'Льготная карта для студентов Москвы. Скидки на транспорт и услуги.',
                url: 'moscow-card.html',
                category: 'finance',
                score: 0.7
            },
            {
                title: 'Общежитие и проживание',
                description: 'Информация о студенческих общежитиях, условиях проживания.',
                url: 'dormitory.html',
                category: 'housing',
                score: 0.8
            },
            {
                title: 'Заселение в общежитие',
                description: 'Процесс заселения в общежитие, необходимые документы, что брать с собой.',
                url: 'dormitory-settlement.html',
                category: 'housing',
                score: 0.75
            },
            {
                title: 'Инфраструктура',
                description: 'Магазины, спортзал, медицинские услуги, транспорт возле университета.',
                url: 'infrastructure.html',
                category: 'housing',
                score: 0.6
            },
            {
                title: 'Жизнь в университете',
                description: 'Студенческая жизнь, мероприятия, организации и возможности.',
                url: 'university-life.html',
                category: 'housing',
                score: 0.65
            },
            {
                title: 'Военная подготовка',
                description: 'Военная кафедра, отсрочка от армии, военкомат.',
                url: 'military.html',
                category: 'military',
                score: 0.6
            },
            {
                title: 'Адаптация первокурсника',
                description: 'Первые дни в университете, знакомство с одногруппниками, начало учебы.',
                url: 'adaptation.html',
                category: 'support',
                score: 0.55
            },
            {
                title: 'Часто задаваемые вопросы',
                description: 'Ответы на популярные вопросы студентов и абитуриентов.',
                url: 'faq.html',
                category: 'support',
                score: 0.5
            }
        ];
        
        const queryLower = query.toLowerCase();
        return searchData.filter(item => 
            item.title.toLowerCase().includes(queryLower) ||
            item.description.toLowerCase().includes(queryLower)
        );
    }
    
    /**
     * Обрабатывает фильтрацию по категориям
     * @param {HTMLElement} filterBtn - Кнопка фильтра
     */
    handleCategoryFilter(filterBtn) {
        // Обновляем активную кнопку
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        filterBtn.classList.add('active');
        
        this.currentCategory = filterBtn.dataset.category;
        this.currentPage = 1;
        this.applyFilters();
        this.renderResults();
    }
    
    /**
     * Обрабатывает сортировку результатов
     * @param {string} sortType - Тип сортировки
     */
    handleSort(sortType) {
        this.currentSort = sortType;
        this.currentPage = 1;
        this.sortResults();
        this.renderResults();
    }
    
    /**
     * Применяет фильтры к результатам
     */
    applyFilters() {
        if (this.currentCategory === 'all') {
            this.filteredResults = [...this.allResults];
        } else {
            this.filteredResults = this.allResults.filter(result => 
                result.category === this.currentCategory
            );
        }
        
        this.sortResults();
    }
    
    /**
     * Сортирует результаты
     */
    sortResults() {
        switch (this.currentSort) {
            case 'relevance':
                this.filteredResults.sort((a, b) => (b.score || 0) - (a.score || 0));
                break;
            case 'alphabetical':
                this.filteredResults.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'date':
                // Пока сортируем по релевантности, так как даты нет
                this.filteredResults.sort((a, b) => (b.score || 0) - (a.score || 0));
                break;
        }
    }
    
    /**
     * Отображает результаты поиска
     */
    renderResults() {
        const resultsGrid = document.getElementById('searchResultsGrid');
        const noResults = document.getElementById('searchNoResults');
        const pagination = document.getElementById('pagination');
        
        if (this.filteredResults.length === 0) {
            resultsGrid.style.display = 'none';
            pagination.style.display = 'none';
            noResults.style.display = 'block';
            return;
        }
        
        noResults.style.display = 'none';
        resultsGrid.style.display = 'grid';
        
        // Пагинация
        const startIndex = (this.currentPage - 1) * this.resultsPerPage;
        const endIndex = startIndex + this.resultsPerPage;
        const pageResults = this.filteredResults.slice(startIndex, endIndex);
        
        // Отображаем результаты
        resultsGrid.innerHTML = pageResults.map(result => this.createResultCard(result)).join('');
        
        // Обновляем пагинацию
        this.renderPagination();
    }
      /**
     * Создает карточку результата поиска
     * @param {Object} result - Результат поиска
     * @returns {string} HTML карточки
     */
    createResultCard(result) {
        const categoryNames = {
            'Поступление': 'Поступление',
            'Финансы': 'Финансы', 
            'Проживание': 'Проживание',
            'Военная подготовка': 'Военная подготовка',
            'Поддержка': 'Поддержка',
            admission: 'Поступление',
            finance: 'Финансы',
            housing: 'Проживание',
            military: 'Военная подготовка',
            support: 'Поддержка',
            other: 'Прочее'
        };
        
        const categoryName = categoryNames[result.category] || 'Прочее';
        const score = Math.round((result.score || result.relevance || 0) * 100);
        
        return `
            <a href="${result.url}" class="search-result-card">
                <div class="search-result-header">
                    <h3 class="search-result-title">${this.highlightQuery(result.title)}</h3>
                    <span class="search-result-category">${categoryName}</span>
                </div>
                <p class="search-result-description">${this.highlightQuery(result.description)}</p>
                <div class="search-result-meta">
                    <div class="search-result-url">
                        <i class="fas fa-link"></i>
                        ${result.url}
                    </div>
                    <div class="search-result-score">Релевантность: ${score}%</div>
                </div>
            </a>
        `;
    }
    
    /**
     * Подсвечивает поисковый запрос в тексте
     * @param {string} text - Исходный текст
     * @returns {string} Текст с подсветкой
     */
    highlightQuery(text) {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        
        if (!query || !text) return text;
        
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }
    
    /**
     * Отображает пагинацию
     */
    renderPagination() {
        const pagination = document.getElementById('pagination');
        const paginationNumbers = document.getElementById('paginationNumbers');
        const prevBtn = document.getElementById('paginationPrev');
        const nextBtn = document.getElementById('paginationNext');
        
        const totalPages = Math.ceil(this.filteredResults.length / this.resultsPerPage);
        
        if (totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }
        
        pagination.style.display = 'flex';
        
        // Кнопки предыдущая/следующая
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === totalPages;
        
        // Номера страниц
        const numbersHTML = [];
        const maxVisible = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        
        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            numbersHTML.push(`
                <button class="pagination-number ${i === this.currentPage ? 'active' : ''}">${i}</button>
            `);
        }
        
        paginationNumbers.innerHTML = numbersHTML.join('');
    }
    
    /**
     * Переходит на указанную страницу
     * @param {number} page - Номер страницы
     */
    goToPage(page) {
        const totalPages = Math.ceil(this.filteredResults.length / this.resultsPerPage);
        
        if (page < 1 || page > totalPages || page === this.currentPage) {
            return;
        }
        
        this.currentPage = page;
        this.renderResults();
        
        // Прокручиваем к началу результатов
        document.getElementById('searchResultsGrid').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    /**
     * Обновляет заголовок страницы с информацией о поиске
     * @param {string} query - Поисковый запрос
     * @param {number} count - Количество результатов
     * @param {number} time - Время поиска в мс
     */
    updateSearchHeader(query, count, time) {
        const queryDisplay = document.getElementById('searchQueryDisplay');
        const searchCount = document.getElementById('searchCount');
        const searchTime = document.getElementById('searchTime');
        
        if (queryDisplay) {
            queryDisplay.textContent = `"${query}"`;
        }
        
        if (searchCount) {
            searchCount.textContent = `Найдено результатов: ${count}`;
        }
        
        if (searchTime) {
            searchTime.textContent = `(${(time / 1000).toFixed(2)} сек)`;
        }
        
        // Обновляем title страницы
        document.title = `Поиск: ${query} - РГАУ-МСХА имени К.А. Тимирязева`;
    }
    
    /**
     * Показывает состояние загрузки
     */
    showLoading() {
        const resultsGrid = document.getElementById('searchResultsGrid');
        resultsGrid.innerHTML = `
            <div class="search-loading">
                <div class="search-loading__spinner"></div>
                <span>Поиск...</span>
            </div>
        `;
    }
    
    /**
     * Показывает состояние "нет результатов"
     */
    showNoResults() {
        const resultsGrid = document.getElementById('searchResultsGrid');
        const noResults = document.getElementById('searchNoResults');
        const pagination = document.getElementById('pagination');
        
        resultsGrid.style.display = 'none';
        pagination.style.display = 'none';
        noResults.style.display = 'block';
        
        // Обновляем заголовок
        const queryDisplay = document.getElementById('searchQueryDisplay');
        const searchCount = document.getElementById('searchCount');
        
        if (queryDisplay) queryDisplay.textContent = '';
        if (searchCount) searchCount.textContent = 'Введите поисковый запрос';
    }
    
    /**
     * Показывает состояние ошибки
     */
    showError() {
        const resultsGrid = document.getElementById('searchResultsGrid');
        resultsGrid.innerHTML = `
            <div class="search-empty">
                <div class="search-empty__icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3 class="search-empty__title">Ошибка поиска</h3>
                <p class="search-empty__text">
                    Произошла ошибка при выполнении поиска. Попробуйте еще раз.
                </p>
            </div>
        `;
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('searchResultsPage')) {
        window.searchResultsPage = new SearchResultsPage();
    }
});
