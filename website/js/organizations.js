// ===== СИСТЕМА УПРАВЛЕНИЯ ОРГАНИЗАЦИЯМИ =====

const OrganizationsManager = {
  // Данные организаций
  data: null,
  
  // Инициализация
  async init() {
    await this.loadData();
    this.setupEventListeners();
  },
  // Загрузка данных организаций
  async loadData() {
    try {
      // Определяем правильный путь к JSON файлу
      const currentPath = window.location.pathname;
      let dataPath = '';
      
      if (currentPath.includes('/pages/organizations/')) {
        dataPath = '../../data/organizations.json';
      } else if (currentPath.includes('/pages/')) {
        dataPath = '../data/organizations.json';
      } else {
        dataPath = 'data/organizations.json';
      }
      
      console.log('🔄 Загружаем данные из:', dataPath);
      const response = await fetch(dataPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.data = await response.json();
      console.log('📊 Данные организаций загружены:', this.data);
    } catch (error) {
      console.error('❌ Ошибка загрузки данных организаций:', error);
      // Используем заглушку, если не удалось загрузить данные
      this.data = {
        organizations: [],
        categories: []
      };
    }
  },

  // Получение организации по ID
  getOrganization(id) {
    if (!this.data || !this.data.organizations) {
      return null;
    }
    return this.data.organizations.find(org => org.id === id);
  },

  // Получение организаций по категории
  getOrganizationsByCategory(categoryId) {
    if (!this.data || !this.data.organizations) {
      return [];
    }
    return this.data.organizations.filter(org => org.category === categoryId && org.active);
  },

  // Получение всех активных организаций
  getActiveOrganizations() {
    if (!this.data || !this.data.organizations) {
      return [];
    }
    return this.data.organizations.filter(org => org.active);
  },

  // Получение рекомендуемых организаций
  getFeaturedOrganizations() {
    if (!this.data || !this.data.organizations) {
      return [];
    }
    return this.data.organizations.filter(org => org.featured && org.active);
  },

  // Получение категории по ID
  getCategory(id) {
    if (!this.data || !this.data.categories) {
      return null;
    }
    return this.data.categories.find(cat => cat.id === id);
  },

  // Создание карточки организации
  createOrganizationCard(organization) {
    const category = this.getCategory(organization.category);
    
    return `
      <div class="card organization-card" data-org-id="${organization.id}">
        <div class="card__header">
          <div class="organization-card__logo">
            <img src="${organization.logo}" alt="${organization.name}" loading="lazy">
          </div>
          <div class="organization-card__info">
            <h3 class="card__title">${organization.name}</h3>
            <div class="card__subtitle">${category ? category.name : ''}</div>
          </div>
        </div>
        <div class="card__content">
          <p class="card__text">${Utils.truncateText(organization.description, 150)}</p>
        </div>
        <div class="card__footer">
          <div class="organization-card__actions">
            <a href="organizations/${organization.id}.html" class="btn btn-primary btn-sm">Подробнее</a>
            ${organization.contacts.vk ? `<a href="${organization.contacts.vk}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">ВК</a>` : ''}
            ${organization.contacts.telegram ? `<a href="${organization.contacts.telegram}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">TG</a>` : ''}
          </div>
        </div>
      </div>
    `;
  },

  // Создание списка организаций
  createOrganizationsList(organizations, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`❌ Контейнер ${containerId} не найден`);
      return;
    }

    if (!organizations || organizations.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <h3>Организации не найдены</h3>
          <p>В данной категории пока нет доступных организаций.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = organizations.map(org => this.createOrganizationCard(org)).join('');
  },

  // Создание фильтра по категориям
  createCategoryFilter(containerId) {
    const container = document.getElementById(containerId);
    if (!container || !this.data || !this.data.categories) {
      return;
    }

    const filterHTML = `
      <div class="category-filter">
        <button class="filter-btn active" data-category="all">Все организации</button>
        ${this.data.categories.map(category => `
          <button class="filter-btn" data-category="${category.id}">${category.name}</button>
        `).join('')}
      </div>
    `;

    container.innerHTML = filterHTML;
  },

  // Фильтрация организаций
  filterOrganizations(categoryId) {
    const organizations = categoryId === 'all' 
      ? this.getActiveOrganizations() 
      : this.getOrganizationsByCategory(categoryId);
    
    this.createOrganizationsList(organizations, 'organizationsList');
  },

  // Поиск организаций
  searchOrganizations(query) {
    if (!this.data || !this.data.organizations || !query.trim()) {
      return this.getActiveOrganizations();
    }

    const searchTerm = query.toLowerCase().trim();
    return this.data.organizations.filter(org => {
      return org.active && (
        org.name.toLowerCase().includes(searchTerm) ||
        org.description.toLowerCase().includes(searchTerm) ||
        org.mission.toLowerCase().includes(searchTerm)
      );
    });
  },

  // Настройка обработчиков событий
  setupEventListeners() {
    // Обработчик кликов по фильтрам категорий
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-btn')) {
        // Убираем активный класс у всех кнопок
        document.querySelectorAll('.filter-btn').forEach(btn => {
          btn.classList.remove('active');
        });
        
        // Добавляем активный класс к нажатой кнопке
        e.target.classList.add('active');
        
        // Фильтруем организации
        const categoryId = e.target.getAttribute('data-category');
        this.filterOrganizations(categoryId);
      }
    });

    // Обработчик поиска (если есть поисковое поле)
    const searchInput = document.getElementById('organizationSearch');
    if (searchInput) {
      let searchTimeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          const results = this.searchOrganizations(e.target.value);
          this.createOrganizationsList(results, 'organizationsList');
        }, 300);
      });
    }
  },

  // Инициализация страницы списка организаций
  initOrganizationsPage() {
    // Создаем фильтр категорий
    this.createCategoryFilter('categoryFilter');
    
    // Показываем все организации по умолчанию
    this.createOrganizationsList(this.getActiveOrganizations(), 'organizationsList');
    
    // Добавляем статистику
    this.updateStats();
  },

  // Обновление статистики
  updateStats() {
    const statsContainer = document.getElementById('organizationsStats');
    if (!statsContainer || !this.data) {
      return;
    }

    const totalOrgs = this.getActiveOrganizations().length;
    const featuredOrgs = this.getFeaturedOrganizations().length;
    const categoriesCount = this.data.categories.length;

    statsContainer.innerHTML = `
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-number">${totalOrgs}</div>
          <div class="stat-label">организаций</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">${categoriesCount}</div>
          <div class="stat-label">категорий</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">${featuredOrgs}</div>
          <div class="stat-label">рекомендуемых</div>
        </div>
      </div>
    `;
  },

  // Генерация хлебных крошек
  generateBreadcrumbs(organizationId) {
    const organization = this.getOrganization(organizationId);
    if (!organization) return '';

    const category = this.getCategory(organization.category);
    
    return `
      <nav class="breadcrumbs" aria-label="Навигация по сайту">
        <ol class="breadcrumbs__list">
          <li class="breadcrumbs__item">
            <a href="/website/" class="breadcrumbs__link">Главная</a>
          </li>
          <li class="breadcrumbs__item">
            <a href="/website/pages/organizations/" class="breadcrumbs__link">Студенческие организации</a>
          </li>
          ${category ? `
            <li class="breadcrumbs__item">
              <span class="breadcrumbs__text">${category.name}</span>
            </li>
          ` : ''}
          <li class="breadcrumbs__item">
            <span class="breadcrumbs__text">${organization.name}</span>
          </li>
        </ol>
      </nav>
    `;
  }
};

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OrganizationsManager;
}

// Автоинициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  OrganizationsManager.init();
});
