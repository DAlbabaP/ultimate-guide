// ===== ИНТЕРАКТИВНОЕ МЕНЮ И НАВИГАЦИЯ =====

const Navigation = {
  // Элементы DOM
  elements: {
    mobileToggle: null,
    mobileMenu: null,
    mobileMenuOverlay: null,
    mobileMenuClose: null,
    mobileMenuToggles: null,
    navLinks: null,
    dropdowns: null
  },

  // Состояние
  isMobileMenuOpen: false,
  activeDropdown: null,

  // Инициализация
  init() {
    this.findElements();
    this.bindEvents();
    this.updateBreadcrumbs();
    console.log('🧭 Навигация инициализирована');
  },
  // Поиск элементов в DOM
  findElements() {
    this.elements.mobileToggle = document.querySelector('#mobileMenuToggle');
    this.elements.mobileMenu = document.querySelector('#mobileMenu');
    this.elements.mobileMenuOverlay = document.querySelector('#mobileMenuOverlay');
    this.elements.mobileMenuClose = document.querySelector('#mobileMenuClose');
    this.elements.mobileMenuToggles = document.querySelectorAll('.mobile-menu__toggle');
    this.elements.navLinks = document.querySelectorAll('.nav__link');
    this.elements.dropdowns = document.querySelectorAll('.nav__dropdown');
  },

  // Привязка событий
  bindEvents() {
    // Мобильное меню - открытие
    if (this.elements.mobileToggle) {
      this.elements.mobileToggle.addEventListener('click', () => {
        this.toggleMobileMenu();
      });
    }

    // Мобильное меню - закрытие
    if (this.elements.mobileMenuClose) {
      this.elements.mobileMenuClose.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    }

    // Закрытие мобильного меню при клике на overlay
    if (this.elements.mobileMenuOverlay) {
      this.elements.mobileMenuOverlay.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    }

    // Аккордеон в мобильном меню
    this.elements.mobileMenuToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        this.toggleMobileSubmenu(e.target.closest('.mobile-menu__toggle'));
      });
    });    // Закрытие меню при клике на ссылку
    const mobileLinks = document.querySelectorAll('.mobile-menu__link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    });

    // Выпадающие меню на десктопе
    this.elements.navLinks.forEach(link => {
      const dropdown = link.nextElementSibling;
      if (dropdown && dropdown.classList.contains('nav__dropdown')) {
        // Показываем при наведении
        link.parentElement.addEventListener('mouseenter', () => {
          this.showDropdown(dropdown);
        });

        // Скрываем при уходе курсора
        link.parentElement.addEventListener('mouseleave', () => {
          this.hideDropdown(dropdown);
        });
      }
    });

    // Активная ссылка
    this.setActiveLink();

    // Обработка кликов по ссылкам с якорями
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href^="#"]')) {
        this.handleAnchorClick(e);
      }
    });

    // Обновление активной ссылки при прокрутке
    window.addEventListener('scroll', App.utils.throttle(() => {
      this.updateActiveSection();
    }, 100));
  },
  // Переключить мобильное меню
  toggleMobileMenu() {
    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  },

  // Открыть мобильное меню
  openMobileMenu() {
    if (this.elements.mobileMenu && this.elements.mobileMenuOverlay) {
      this.elements.mobileMenu.classList.add('active');
      this.elements.mobileMenuOverlay.classList.add('active');
      this.elements.mobileToggle.classList.add('active');
      document.body.style.overflow = 'hidden';
      this.isMobileMenuOpen = true;
    }
  },

  // Закрыть мобильное меню
  closeMobileMenu() {
    if (this.elements.mobileMenu && this.elements.mobileMenuOverlay) {
      this.elements.mobileMenu.classList.remove('active');
      this.elements.mobileMenuOverlay.classList.remove('active');
      this.elements.mobileToggle.classList.remove('active');
      document.body.style.overflow = '';
      this.isMobileMenuOpen = false;
      
      // Закрываем все открытые подменю
      this.closeAllMobileSubmenus();
    }
  },

  // Переключить подменю в мобильном меню
  toggleMobileSubmenu(toggle) {
    const section = toggle.dataset.section;
    const submenu = document.getElementById(`submenu-${section}`);
    const isActive = toggle.classList.contains('active');

    if (isActive) {
      // Закрываем подменю
      toggle.classList.remove('active');
      submenu.classList.remove('active');
    } else {
      // Закрываем все другие подменю
      this.closeAllMobileSubmenus();
      
      // Открываем выбранное подменю
      toggle.classList.add('active');
      submenu.classList.add('active');
    }
  },

  // Закрыть все мобильные подменю
  closeAllMobileSubmenus() {
    const activeToggles = document.querySelectorAll('.mobile-menu__toggle.active');
    const activeSubmenus = document.querySelectorAll('.mobile-menu__submenu.active');
    
    activeToggles.forEach(toggle => toggle.classList.remove('active'));
    activeSubmenus.forEach(submenu => submenu.classList.remove('active'));
  },

  // Показать выпадающее меню
  showDropdown(dropdown) {
    // Скрываем другие открытые выпадающие меню
    this.hideAllDropdowns();
    
    if (dropdown) {
      dropdown.style.display = 'block';
      this.activeDropdown = dropdown;
    }
  },

  // Скрыть выпадающее меню
  hideDropdown(dropdown) {
    if (dropdown) {
      dropdown.style.display = 'none';
      if (this.activeDropdown === dropdown) {
        this.activeDropdown = null;
      }
    }
  },

  // Скрыть все выпадающие меню
  hideAllDropdowns() {
    this.elements.dropdowns.forEach(dropdown => {
      dropdown.style.display = 'none';
    });
    this.activeDropdown = null;
  },

  // Установить активную ссылку
  setActiveLink() {
    const currentPath = window.location.pathname;
    
    this.elements.navLinks.forEach(link => {
      const href = link.getAttribute('href');
      
      // Убираем активный класс
      link.classList.remove('nav__link--active');
      
      // Проверяем соответствие пути
      if (href && currentPath.includes(href.replace('./', ''))) {
        link.classList.add('nav__link--active');
      }
    });
  },

  // Обработка клика по якорной ссылке
  handleAnchorClick(e) {
    e.preventDefault();
    const href = e.target.getAttribute('href');
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Учитываем высоту фиксированного хедера
      const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
      const offset = headerHeight + 20;
      
      App.utils.scrollToElement(targetElement, offset);
      
      // Обновляем URL без перезагрузки страницы
      if (history.pushState) {
        history.pushState(null, null, href);
      }
    }
  },

  // Обновление активной секции при прокрутке
  updateActiveSection() {
    const sections = document.querySelectorAll('section[id], .section[id]');
    const scrollTop = window.pageYOffset;
    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
    
    let activeSection = null;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - headerHeight - 50;
      const sectionBottom = sectionTop + section.offsetHeight;
      
      if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
        activeSection = section.id;
      }
    });
    
    // Обновляем активные ссылки в боковой навигации
    if (activeSection) {
      const sidebarLinks = document.querySelectorAll('.sidebar-nav__link');
      sidebarLinks.forEach(link => {
        link.classList.remove('sidebar-nav__link--active');
        if (link.getAttribute('href') === `#${activeSection}`) {
          link.classList.add('sidebar-nav__link--active');
        }
      });
    }
  },

  // Обновление хлебных крошек
  updateBreadcrumbs() {
    const breadcrumb = document.querySelector('.breadcrumb__list');
    if (!breadcrumb) return;

    const path = window.location.pathname;
    const breadcrumbs = this.generateBreadcrumbs(path);
    
    breadcrumb.innerHTML = breadcrumbs.map((crumb, index) => {
      const isLast = index === breadcrumbs.length - 1;
      
      if (isLast) {
        return `<li class="breadcrumb__item">
          <span class="breadcrumb__current">${crumb.title}</span>
        </li>`;
      } else {
        return `<li class="breadcrumb__item">
          <a href="${crumb.url}" class="breadcrumb__link">${crumb.title}</a>
        </li>`;
      }
    }).join('');
  },

  // Генерация хлебных крошек на основе пути
  generateBreadcrumbs(path) {
    const breadcrumbs = [{ title: 'Главная', url: './' }];
    
    // Парсим путь и создаем крошки
    const segments = path.split('/').filter(segment => segment && segment !== '.');
    
    let currentPath = './';
    
    segments.forEach((segment, index) => {
      currentPath += segment + '/';
      
      let title = this.getPageTitle(segment);
      
      breadcrumbs.push({
        title: title,
        url: currentPath
      });
    });

    return breadcrumbs;
  },

  // Получение заголовка страницы по сегменту URL
  getPageTitle(segment) {
    const titles = {
      'pages': 'Разделы',
      'applicant-path': 'Путь абитуриента',
      'university-life': 'Жизнь в университете', 
      'scholarships': 'Стипендии и льготы',
      'organizations': 'Студенческие организации',
      'military': 'Военная подготовка',
      'self-government': 'Студенческое самоуправление',
      'support': 'Поддержка',
      'documents.html': 'Подача документов',
      'selection.html': 'Конкурсный отбор',
      'enrollment.html': 'Зачисление',
      'settlement.html': 'Заселение',
      'adaptation.html': 'Адаптация',
      'dormitory.html': 'Общежитие',
      'infrastructure.html': 'Инфраструктура',
      'academic-process.html': 'Учебный процесс'
    };

    return titles[segment] || segment.replace(/[-_]/g, ' ').replace(/\.html$/, '');
  },

  // Создание боковой навигации для длинных страниц
  createSidebarNav(container) {
    const headings = document.querySelectorAll('h2[id], h3[id]');
    if (headings.length === 0) return;

    const nav = document.createElement('nav');
    nav.className = 'sidebar-nav';
    
    const title = document.createElement('h3');
    title.className = 'sidebar-nav__title';
    title.textContent = 'Содержание';
    nav.appendChild(title);
    
    const list = document.createElement('ul');
    list.className = 'sidebar-nav__list';
    
    headings.forEach(heading => {
      const item = document.createElement('li');
      item.className = 'sidebar-nav__item';
      
      const link = document.createElement('a');
      link.className = 'sidebar-nav__link';
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent;
      
      // Добавляем отступ для H3
      if (heading.tagName === 'H3') {
        link.style.paddingLeft = '24px';
      }
      
      item.appendChild(link);
      list.appendChild(item);
      
      // Привязываем событие клика
      link.addEventListener('click', (e) => {
        this.handleAnchorClick(e);
      });
    });
    
    nav.appendChild(list);
    container.appendChild(nav);
  },

  // Создание кнопки "Наверх"
  createBackToTopButton() {
    const button = document.createElement('button');
    button.className = 'back-to-top';
    button.innerHTML = '↑';
    button.setAttribute('aria-label', 'Вернуться наверх');
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      background-color: var(--primary-green);
      color: var(--primary-white);
      border: none;
      border-radius: 50%;
      font-size: 1.2rem;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transition: all var(--transition-fast);
      z-index: 1000;
      box-shadow: var(--shadow-medium);
    `;

    // Стили для видимого состояния
    const style = document.createElement('style');
    style.textContent = `
      .back-to-top.visible {
        opacity: 1 !important;
        visibility: visible !important;
      }
      .back-to-top:hover {
        background-color: #255125 !important;
        transform: translateY(-2px) !important;
      }
    `;
    document.head.appendChild(style);

    button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    document.body.appendChild(button);
  }
};

// Экспортируем для использования в других модулях
window.Navigation = Navigation;
