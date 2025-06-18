// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====

const Utils = {
  // Валидация email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Валидация телефона (российские номера)
  isValidPhone(phone) {
    const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  // Форматирование телефона
  formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned[0] === '8') {
      return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`;
    } else if (cleaned.length === 11 && cleaned[0] === '7') {
      return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`;
    }
    return phone;
  },

  // Экранирование HTML
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // Удаление HTML тегов
  stripHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  },

  // Усечение текста
  truncateText(text, maxLength, suffix = '...') {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
  },

  // Форматирование размера файла
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Б';
    
    const k = 1024;
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Форматирование числа с разделителями
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  },

  // Копирование текста в буфер обмена
  async copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback для старых браузеров
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const success = document.execCommand('copy');
        textArea.remove();
        return success;
      }
    } catch (error) {
      console.error('Ошибка копирования:', error);
      return false;
    }
  },

  // Генерация уникального ID
  generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Получение параметров URL
  getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) {
      result[key] = value;
    }
    return result;
  },

  // Обновление параметра URL без перезагрузки
  updateUrlParam(key, value) {
    const url = new URL(window.location);
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
    window.history.replaceState({}, '', url);
  },

  // Определение устройства
  getDeviceType() {
    const width = window.innerWidth;
    if (width <= 768) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
  },

  // Определение операционной системы
  getOS() {
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;
    const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
    const iosPlatforms = ['iPhone', 'iPad', 'iPod'];

    if (macosPlatforms.indexOf(platform) !== -1) {
      return 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      return 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      return 'Windows';
    } else if (/Android/.test(userAgent)) {
      return 'Android';
    } else if (!platform && /Linux/.test(userAgent)) {
      return 'Linux';
    }

    return 'Unknown';
  },

  // Получение информации о браузере
  getBrowserInfo() {
    const userAgent = navigator.userAgent;
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';

    if (userAgent.indexOf('Chrome') > -1) {
      browserName = 'Chrome';
      browserVersion = userAgent.match(/Chrome\/([0-9.]+)/)?.[1];
    } else if (userAgent.indexOf('Safari') > -1) {
      browserName = 'Safari';
      browserVersion = userAgent.match(/Version\/([0-9.]+)/)?.[1];
    } else if (userAgent.indexOf('Firefox') > -1) {
      browserName = 'Firefox';
      browserVersion = userAgent.match(/Firefox\/([0-9.]+)/)?.[1];
    } else if (userAgent.indexOf('Edge') > -1) {
      browserName = 'Edge';
      browserVersion = userAgent.match(/Edge\/([0-9.]+)/)?.[1];
    }

    return { name: browserName, version: browserVersion };
  },

  // Проверка поддержки функций браузера
  checkBrowserSupport() {
    const support = {
      localStorage: typeof Storage !== 'undefined',
      sessionStorage: typeof Storage !== 'undefined',
      intersectionObserver: 'IntersectionObserver' in window,
      fetch: 'fetch' in window,
      webGL: !!window.WebGLRenderingContext,
      touch: 'ontouchstart' in window,
      geolocation: 'geolocation' in navigator,
      clipboard: 'clipboard' in navigator,
      serviceWorker: 'serviceWorker' in navigator
    };

    return support;
  },

  // Сохранение данных в localStorage с проверкой
  saveToStorage(key, data) {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error('Ошибка сохранения в localStorage:', error);
      return false;
    }
  },

  // Загрузка данных из localStorage
  loadFromStorage(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Ошибка загрузки из localStorage:', error);
      return defaultValue;
    }
  },

  // Очистка старых данных из localStorage
  cleanOldStorage(maxAge = 7 * 24 * 60 * 60 * 1000) { // 7 дней по умолчанию
    const now = Date.now();
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('temp_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          if (data.timestamp && (now - data.timestamp) > maxAge) {
            localStorage.removeItem(key);
          }
        } catch (error) {
          // Если не удается распарсить, удаляем
          localStorage.removeItem(key);
        }
      }
    }
  },

  // Создание cookie
  setCookie(name, value, days = 30) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  },

  // Получение cookie
  getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    
    return null;
  },

  // Удаление cookie
  deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  },

  // Ленивая загрузка изображений
  lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback для старых браузеров
      images.forEach(img => {
        img.src = img.dataset.src;
        img.classList.remove('lazy');
      });
    }
  },

  // Создание элемента с атрибутами
  createElement(tag, attributes = {}, textContent = '') {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'innerHTML') {
        element.innerHTML = value;
      } else {
        element.setAttribute(key, value);
      }
    });
    
    if (textContent) {
      element.textContent = textContent;
    }
    
    return element;
  },

  // Загрузка внешнего скрипта
  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  },

  // Загрузка CSS
  loadCSS(href) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  },

  // Простая валидация формы
  validateForm(form) {
    const errors = [];
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      const value = input.value.trim();
      const required = input.hasAttribute('required');
      const type = input.type;
      
      if (required && !value) {
        errors.push(`Поле "${input.name || input.id}" обязательно для заполнения`);
        return;
      }
      
      if (value) {
        switch (type) {
          case 'email':
            if (!this.isValidEmail(value)) {
              errors.push(`Некорректный email в поле "${input.name || input.id}"`);
            }
            break;
          case 'tel':
            if (!this.isValidPhone(value)) {
              errors.push(`Некорректный номер телефона в поле "${input.name || input.id}"`);
            }
            break;
          case 'url':
            try {
              new URL(value);
            } catch {
              errors.push(`Некорректный URL в поле "${input.name || input.id}"`);
            }
            break;
        }
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  },

  // Загрузка компонентов (header, footer)
  async loadComponent(elementId, componentPath, basePath = '') {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        console.warn(`Элемент с ID "${elementId}" не найден`);
        return false;
      }

      const response = await fetch(basePath + componentPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
        const html = await response.text();
      element.innerHTML = html;
        // Если загружен header, инициализируем навигацию
      if (elementId === 'mainHeader') {
        this.initNavigation();
      }
      
      return true;
    } catch (error) {
      console.error(`Ошибка загрузки компонента ${componentPath}:`, error);
      return false;
    }
  },  // Загрузка всех компонентов страницы
  async loadAllComponents(basePath = '') {
    const components = [
      { id: 'mainHeader', path: 'components/header.html' },
      { id: 'mainFooter', path: 'components/footer.html' }
    ];

    const promises = components.map(component => 
      this.loadComponent(component.id, component.path, basePath)
    );

    await Promise.all(promises);
    
    // Исправляем пути в загруженных компонентах
    this.fixComponentPaths(basePath);
    
    // Генерируем breadcrumb навигацию
    this.generateBreadcrumb();
    
    // Инициализируем поиск после загрузки компонентов
    if (typeof Search !== 'undefined') {
      Search.init();
    }
  },

  // Исправление путей в компонентах
  fixComponentPaths(basePath = '') {
    // Исправляем пути в логотипе
    const logoLinks = document.querySelectorAll('.header__logo');
    logoLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === './') {
        link.setAttribute('href', basePath || './');
      }
    });

    // Исправляем пути в навигации
    const navLinks = document.querySelectorAll('.nav__link, .nav__dropdown-link, .nav__mobile-link, .footer__links a');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('./pages/')) {
        link.setAttribute('href', basePath + href);
      }
    });
  },

  // Инициализация навигации после загрузки header
  initNavigation() {
    // Мобильное меню
    const mobileToggle = document.querySelector('.header__mobile-toggle');
    const mobileNav = document.querySelector('.nav--mobile');
    const mobileClose = document.querySelector('.nav__mobile-close');

    if (mobileToggle && mobileNav) {
      mobileToggle.addEventListener('click', () => {
        mobileNav.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }

    if (mobileClose && mobileNav) {
      mobileClose.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    // Закрытие по клику вне меню
    if (mobileNav) {
      mobileNav.addEventListener('click', (e) => {
        if (e.target === mobileNav) {
          mobileNav.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }

    // Dropdown меню
    const navItems = document.querySelectorAll('.nav__item');
    navItems.forEach(item => {
      const link = item.querySelector('.nav__link');
      const dropdown = item.querySelector('.nav__dropdown');
      
      if (link && dropdown) {
        let timeout;
        
        item.addEventListener('mouseenter', () => {
          clearTimeout(timeout);
          dropdown.style.display = 'block';
          setTimeout(() => dropdown.classList.add('active'), 10);
        });
        
        item.addEventListener('mouseleave', () => {
          dropdown.classList.remove('active');
          timeout = setTimeout(() => {
            dropdown.style.display = 'none';
          }, 300);
        });
      }
    });

    // Активная страница
    this.setActiveNavItem();
  },

  // Установка активного пункта навигации
  setActiveNavItem() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav__link, .nav__mobile-link');
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      
      if (href && currentPath.includes(href.replace('./', ''))) {
        link.classList.add('active');
      }
    });
  },

  // Генерация breadcrumb навигации
  generateBreadcrumb() {
    const breadcrumbList = document.getElementById('breadcrumb-list');
    if (!breadcrumbList) return;

    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/').filter(part => part && part !== 'index.html');
    
    // Всегда добавляем главную страницу
    const breadcrumbItems = [
      { title: 'Главная', url: '/' }
    ];

    // Маппинг путей к человекочитаемым названиям
    const pathMap = {
      'pages': '',
      'applicant-path': 'Путь абитуриента',
      'university-life': 'Жизнь в университете',
      'scholarships': 'Стипендии и льготы',
      'organizations': 'Студенческие организации',
      'self-government': 'Студенческое самоуправление',
      'leader-requirements': 'Кто такой староста',
      'responsibilities': 'Что делают старосты',
      'military': 'Военная подготовка',
      'support': 'Поддержка',
      'faq': 'Часто задаваемые вопросы'
    };

    let currentUrl = '';
    
    pathParts.forEach((part, index) => {
      if (pathMap[part]) {
        currentUrl += '/' + part;
        breadcrumbItems.push({
          title: pathMap[part],
          url: currentUrl
        });
      }
    });

    // Очищаем список
    breadcrumbList.innerHTML = '';

    // Генерируем элементы
    breadcrumbItems.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'breadcrumb__item';

      if (index === breadcrumbItems.length - 1) {
        // Последний элемент - текущая страница
        li.innerHTML = `<span class="breadcrumb__current">${item.title}</span>`;
      } else {
        // Ссылка на предыдущие уровни
        const depth = (window.location.pathname.match(/\//g) || []).length;
        const basePath = '../'.repeat(Math.max(0, depth - 1));
        li.innerHTML = `
          <a href="${basePath}${item.url}" class="breadcrumb__link">${item.title}</a>
          <span class="breadcrumb__separator">›</span>
        `;
      }

      breadcrumbList.appendChild(li);
    });
  },
};

// Экспортируем для использования в других модулях
window.Utils = Utils;
