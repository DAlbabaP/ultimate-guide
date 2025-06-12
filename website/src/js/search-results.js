// ===== МОДУЛЬ УПРАВЛЕНИЯ СТРАНИЦЕЙ РЕЗУЛЬТАТОВ ПОИСКА =====

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
        this.getResults();
        this.renderResults();
        this.setupEventListeners();
    }

    getResults() {
        // Имитация получения данных
        const dummyData = [
            { id: 1, title: 'Результат 1', category: 'news', relevance: 5 },
            { id: 2, title: 'Результат 2', category: 'blogs', relevance: 3 },
            { id: 3, title: 'Результат 3', category: 'news', relevance: 4 },
            { id: 4, title: 'Результат 4', category: 'products', relevance: 2 },
            { id: 5, title: 'Результат 5', category: 'blogs', relevance: 1 },
            // ...дополнительные данные...
        ];

        this.allResults = dummyData;
        this.filteredResults = dummyData;
    }

    renderResults() {
        const resultsContainer = document.getElementById('results-container');
        resultsContainer.innerHTML = '';

        const start = (this.currentPage - 1) * this.resultsPerPage;
        const end = start + this.resultsPerPage;
        const paginatedResults = this.filteredResults.slice(start, end);

        paginatedResults.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.classList.add('result-item');
            resultElement.innerText = result.title;
            resultsContainer.appendChild(resultElement);
        });

        this.updatePagination();
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredResults.length / this.resultsPerPage);
        const paginationContainer = document.getElementById('pagination-container');
        paginationContainer.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.innerText = i;
            pageButton.classList.add('page-button');
            if (i === this.currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', () => {
                this.currentPage = i;
                this.renderResults();
            });
            paginationContainer.appendChild(pageButton);
        }
    }

    setupEventListeners() {
        const categoryFilters = document.querySelectorAll('.category-filter');
        categoryFilters.forEach(filter => {
            filter.addEventListener('click', (e) => {
                this.currentCategory = e.target.dataset.category;
                this.filterResults();
            });
        });

        const sortOptions = document.querySelectorAll('.sort-option');
        sortOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                this.currentSort = e.target.dataset.sort;
                this.sortResults();
            });
        });
    }

    filterResults() {
        if (this.currentCategory === 'all') {
            this.filteredResults = this.allResults;
        } else {
            this.filteredResults = this.allResults.filter(result => result.category === this.currentCategory);
        }
        this.renderResults();
    }

    sortResults() {
        this.filteredResults.sort((a, b) => {
            if (this.currentSort === 'relevance') {
                return b.relevance - a.relevance;
            } else {
                return a.title.localeCompare(b.title);
            }
        });
        this.renderResults();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SearchResultsPage();
});
