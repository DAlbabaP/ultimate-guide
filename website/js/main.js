// ===== ОСНОВНАЯ ЛОГИКА И ИНИЦИАЛИЗАЦИЯ =====

// Основной объект приложения
const App = {
  // Конфигурация
  config: {
    searchDelay: 300,
    animationDuration: 300,
    breakpoints: {
      mobile: 768,
      tablet: 991,
      desktop: 1200
    }
  },

  // Инициализация приложения
  init() {
    console.log('🎓 Инициализация сайта для абитуриентов...');
    
    // Ждем загрузки DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.start();
      });
    } else {
      this.start();
    }
  },  // Запуск всех компонентов
  async start() {
    // Определяем базовый путь для загрузки компонентов
    const currentPath = window.location.pathname;
    let basePath = '';
    
    if (currentPath.includes('/pages/')) {
      // Считаем количество уровней от папки pages
      const pathParts = currentPath.split('/').filter(part => part && part !== 'index.html');
      const pagesIndex = pathParts.findIndex(part => part === 'pages');
      
      if (pagesIndex >= 0) {
        const levelsFromPages = pathParts.length - pagesIndex - 1;
        basePath = '../'.repeat(levelsFromPages + 1);
      }
    }
    
    console.log('Current path:', currentPath);
    console.log('Base path:', basePath);
    
    // Загружаем компоненты
    await Utils.loadAllComponents(basePath);
    
    this.initComponents();
    this.bindEvents();
    this.loadContent();
    console.log('✅ Сайт успешно инициализирован');
  },

  // Инициализация компонентов
  initComponents() {
    // Инициализируем навигацию
    if (typeof Navigation !== 'undefined') {
      Navigation.init();
    }

    // Инициализируем поиск
    if (typeof Search !== 'undefined') {
      Search.init();
    }

    // Инициализируем анимации
    if (typeof Animations !== 'undefined') {
      Animations.init();
    }

    // Инициализируем временную шкалу
    if (typeof Timeline !== 'undefined') {
      Timeline.init();
    }
  },

  // Привязка глобальных событий
  bindEvents() {
    // Обработка изменения размера окна
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });

    // Обработка прокрутки
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.handleScroll();
      }, 16); // ~60fps
    });

    // Обработка клавиш
    document.addEventListener('keydown', (e) => {
      this.handleKeyPress(e);
    });

    // Обработка кликов по внешним ссылкам
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href^="http"]')) {
        e.target.setAttribute('target', '_blank');
        e.target.setAttribute('rel', 'noopener noreferrer');
      }
    });
  },

  // Загрузка контента
  async loadContent() {
    try {
      // Загружаем данные контента
      if (typeof ContentData === 'undefined') {
        const response = await fetch('./data/content.json');
        if (response.ok) {
          window.ContentData = await response.json();
        }
      }

      // Обновляем поисковый индекс
      if (typeof Search !== 'undefined' && window.ContentData) {
        Search.updateIndex(window.ContentData);
      }
    } catch (error) {
      console.warn('Не удалось загрузить данные контента:', error);
    }
  },

  // Обработка изменения размера окна
  handleResize() {
    const width = window.innerWidth;
    
    // Обновляем состояние мобильного меню
    if (width > this.config.breakpoints.mobile) {
      const mobileNav = document.querySelector('.nav--mobile');
      if (mobileNav && mobileNav.classList.contains('active')) {
        Navigation.closeMobileMenu();
      }
    }

    // Обновляем компоненты, зависящие от размера экрана
    if (typeof Timeline !== 'undefined') {
      Timeline.updateLayout();
    }
  },

  // Обработка прокрутки
  handleScroll() {
    const scrollTop = window.pageYOffset;
    
    // Показываем/скрываем кнопку "Наверх"
    this.toggleBackToTop(scrollTop);
    
    // Обновляем прогресс временной шкалы
    if (typeof Timeline !== 'undefined') {
      Timeline.updateProgress(scrollTop);
    }
  },

  // Показать/скрыть кнопку "Наверх"
  toggleBackToTop(scrollTop) {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
      if (scrollTop > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  },

  // Обработка нажатий клавиш
  handleKeyPress(e) {
    // Открытие поиска по Ctrl+K или Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.querySelector('.search__input');
      if (searchInput) {
        searchInput.focus();
      }
    }

    // Закрытие модальных окон по Escape
    if (e.key === 'Escape') {
      // Закрываем мобильное меню
      const mobileNav = document.querySelector('.nav--mobile.active');
      if (mobileNav && typeof Navigation !== 'undefined') {
        Navigation.closeMobileMenu();
      }

      // Очищаем поиск
      if (typeof Search !== 'undefined') {
        Search.clearSuggestions();
      }
    }
  },

  // Утилиты
  utils: {
    // Debounce функция
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    // Throttle функция
    throttle(func, limit) {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },

    // Проверка мобильного устройства
    isMobile() {
      return window.innerWidth <= App.config.breakpoints.mobile;
    },

    // Плавная прокрутка к элементу
    scrollToElement(element, offset = 0) {
      if (typeof element === 'string') {
        element = document.querySelector(element);
      }
      
      if (element) {
        const top = element.offsetTop - offset;
        window.scrollTo({
          top: top,
          behavior: 'smooth'
        });
      }
    },

    // Форматирование даты
    formatDate(date) {
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      return new Date(date).toLocaleDateString('ru-RU', options);
    },

    // Создание уведомления
    showNotification(message, type = 'info') {
      const notification = document.createElement('div');
      notification.className = `notification notification--${type}`;
      notification.textContent = message;
      
      document.body.appendChild(notification);
      
      // Показываем уведомление
      setTimeout(() => {
        notification.classList.add('visible');
      }, 100);
      
      // Скрываем через 5 секунд
      setTimeout(() => {
        notification.classList.remove('visible');
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }, 5000);
    }
  }
};

// Инициализируем приложение
App.init();

// Экспортируем для использования в других модулях
window.App = App;
