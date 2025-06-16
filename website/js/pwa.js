// ===== PWA МОДУЛЬ ДЛЯ УПРАВЛЕНИЯ PROGRESSIVE WEB APP =====

const PWA = {  // Конфигурация
  config: {
    swPath: './sw.js',
    checkInterval: 60000, // Проверка обновлений каждую минуту
    showInstallPrompt: true,
    enableNotifications: true,
    cacheStrategy: 'cache-first'
  },

  // Состояние PWA
  state: {
    isInstalled: false,
    isOnline: navigator.onLine,
    swRegistration: null,
    deferredPrompt: null,
    isInstallable: false,
    updateAvailable: false
  },

  // Элементы интерфейса
  elements: {
    installButton: null,
    updateButton: null,
    offlineIndicator: null,
    installBanner: null
  },

  // ===== ИНИЦИАЛИЗАЦИЯ =====
  init() {
    console.log('📱 Инициализация PWA модуля...');
    
    this.detectPWASupport();
    this.initializeElements();
    this.registerServiceWorker();
    this.bindEvents();
    this.checkOnlineStatus();
    this.createInstallBanner();
    
    console.log('✅ PWA модуль инициализирован');
  },

  // Проверка поддержки PWA
  detectPWASupport() {
    const support = {
      serviceWorker: 'serviceWorker' in navigator,
      beforeInstallPrompt: 'onbeforeinstallprompt' in window,
      manifestApi: 'getInstalledRelatedApps' in navigator,
      notifications: 'Notification' in window,
      share: 'share' in navigator
    };

    console.log('🔍 Поддержка PWA функций:', support);
    return support;
  },

  // Инициализация элементов интерфейса
  initializeElements() {
    this.elements.installButton = document.getElementById('pwa-install-btn');
    this.elements.updateButton = document.getElementById('pwa-update-btn');
    this.elements.offlineIndicator = document.getElementById('offline-indicator');
    
    // Создаем элементы если их нет
    this.createPWAElements();
  },

  // Создание PWA элементов интерфейса
  createPWAElements() {
    // Индикатор офлайн режима
    if (!this.elements.offlineIndicator) {
      const indicator = document.createElement('div');
      indicator.id = 'offline-indicator';
      indicator.className = 'offline-indicator hidden';
      indicator.innerHTML = `
        <div class="offline-content">
          <span class="offline-icon">📡</span>
          <span class="offline-text">Работаем в офлайн режиме</span>
        </div>
      `;
      document.body.appendChild(indicator);
      this.elements.offlineIndicator = indicator;
    }

    // Кнопка обновления
    if (!this.elements.updateButton) {
      const updateBtn = document.createElement('button');
      updateBtn.id = 'pwa-update-btn';
      updateBtn.className = 'pwa-update-btn hidden';
      updateBtn.innerHTML = `
        <span class="update-icon">🔄</span>
        <span class="update-text">Обновить приложение</span>
      `;
      document.body.appendChild(updateBtn);
      this.elements.updateButton = updateBtn;
    }
  },

  // Создание баннера установки
  createInstallBanner() {
    if (this.elements.installBanner) return;

    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.className = 'pwa-install-banner hidden';
    banner.innerHTML = `
      <div class="install-banner-content">
        <div class="install-banner-info">
          <div class="install-banner-icon">📱</div>
          <div class="install-banner-text">
            <div class="install-banner-title">Установить приложение</div>
            <div class="install-banner-description">
              Добавьте справочник на домашний экран для быстрого доступа
            </div>
          </div>
        </div>
        <div class="install-banner-actions">
          <button class="install-btn-primary" id="install-app-btn">
            Установить
          </button>
          <button class="install-btn-secondary" id="close-install-banner">
            ×
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(banner);
    this.elements.installBanner = banner;
  },
  // ===== РЕГИСТРАЦИЯ SERVICE WORKER =====
  async registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      console.warn('⚠️ Service Worker не поддерживается');
      return;
    }

    try {
      console.log('🔄 Регистрация Service Worker по пути:', this.config.swPath);
      const registration = await navigator.serviceWorker.register(this.config.swPath);
      this.state.swRegistration = registration;
      
      console.log('✅ Service Worker зарегистрирован:', registration);

      // Проверка обновлений
      registration.addEventListener('updatefound', () => {
        this.handleSWUpdate(registration);
      });

      // Проверка активного Service Worker
      if (registration.active) {
        this.handleSWActivated();
      }

      // Периодическая проверка обновлений
      this.startUpdateCheck();

    } catch (error) {
      console.error('❌ Ошибка регистрации Service Worker:', error);
      console.error('Путь к SW файлу:', this.config.swPath);
      console.error('Текущий URL:', window.location.href);
    }
  },

  // Обработка обновления Service Worker
  handleSWUpdate(registration) {
    const newWorker = registration.installing;
    console.log('🔄 Найдено обновление Service Worker');

    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        console.log('📦 Новая версия готова к установке');
        this.state.updateAvailable = true;
        this.showUpdateNotification();
      }
    });
  },

  // Обработка активации Service Worker
  handleSWActivated() {
    console.log('✅ Service Worker активирован');
    
    // Проверяем кэш
    this.checkCacheStatus();
  },

  // Запуск периодической проверки обновлений
  startUpdateCheck() {
    setInterval(() => {
      if (this.state.swRegistration) {
        this.state.swRegistration.update();
      }
    }, this.config.checkInterval);
  },

  // ===== УСТАНОВКА PWA =====
  
  // Привязка событий
  bindEvents() {
    // Событие перед установкой PWA
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.state.deferredPrompt = e;
      this.state.isInstallable = true;
      this.showInstallPrompt();
    });

    // Событие после установки PWA
    window.addEventListener('appinstalled', () => {
      console.log('📱 PWA установлена');
      this.state.isInstalled = true;
      this.state.deferredPrompt = null;
      this.hideInstallPrompt();
      this.showNotification('Приложение успешно установлено!', 'success');
    });

    // Изменение статуса сети
    window.addEventListener('online', () => {
      this.state.isOnline = true;
      this.updateOnlineStatus();
      this.showNotification('Соединение восстановлено', 'info');
    });

    window.addEventListener('offline', () => {
      this.state.isOnline = false;
      this.updateOnlineStatus();
      this.showNotification('Переход в офлайн режим', 'warning');
    });

    // Кнопки установки и обновления
    this.bindButtonEvents();
  },

  // Привязка событий кнопок
  bindButtonEvents() {
    // Кнопка установки в баннере
    const installBtn = document.getElementById('install-app-btn');
    if (installBtn) {
      installBtn.addEventListener('click', () => this.installApp());
    }

    // Кнопка закрытия баннера
    const closeBtn = document.getElementById('close-install-banner');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hideInstallPrompt());
    }

    // Кнопка обновления
    if (this.elements.updateButton) {
      this.elements.updateButton.addEventListener('click', () => this.updateApp());
    }

    // Глобальная кнопка установки (если есть)
    if (this.elements.installButton) {
      this.elements.installButton.addEventListener('click', () => this.installApp());
    }
  },

  // Показать промпт установки
  showInstallPrompt() {
    if (!this.config.showInstallPrompt || this.state.isInstalled) return;

    // Проверяем, не скрывал ли пользователь баннер
    const hiddenTime = localStorage.getItem('pwa-install-hidden');
    if (hiddenTime && (Date.now() - parseInt(hiddenTime)) < 7 * 24 * 60 * 60 * 1000) {
      return; // Не показываем 7 дней после скрытия
    }

    if (this.elements.installBanner) {
      this.elements.installBanner.classList.remove('hidden');
      
      // Анимация появления
      setTimeout(() => {
        this.elements.installBanner.classList.add('visible');
      }, 100);
    }
  },

  // Скрыть промпт установки
  hideInstallPrompt() {
    if (this.elements.installBanner) {
      this.elements.installBanner.classList.remove('visible');
      setTimeout(() => {
        this.elements.installBanner.classList.add('hidden');
      }, 300);
      
      // Запоминаем, что пользователь скрыл баннер
      localStorage.setItem('pwa-install-hidden', Date.now().toString());
    }
  },

  // Установка приложения
  async installApp() {
    if (!this.state.deferredPrompt) {
      this.showNotification('Установка недоступна', 'error');
      return;
    }

    try {
      // Показываем промпт установки
      this.state.deferredPrompt.prompt();
      
      // Ждем выбора пользователя
      const result = await this.state.deferredPrompt.userChoice;
      
      if (result.outcome === 'accepted') {
        console.log('✅ Пользователь согласился на установку');
        this.trackEvent('pwa_install_accepted');
      } else {
        console.log('❌ Пользователь отклонил установку');
        this.trackEvent('pwa_install_declined');
      }

      this.state.deferredPrompt = null;
      this.hideInstallPrompt();

    } catch (error) {
      console.error('❌ Ошибка установки PWA:', error);
      this.showNotification('Ошибка при установке', 'error');
    }
  },

  // ===== ОБНОВЛЕНИЯ =====

  // Показать уведомление об обновлении
  showUpdateNotification() {
    if (this.elements.updateButton) {
      this.elements.updateButton.classList.remove('hidden');
      this.elements.updateButton.classList.add('visible');
    }

    this.showNotification('Доступно обновление приложения', 'info', {
      persistent: true,
      action: {
        text: 'Обновить',
        callback: () => this.updateApp()
      }
    });
  },

  // Обновление приложения
  async updateApp() {
    if (!this.state.swRegistration) return;

    try {
      // Говорим новому Service Worker взять управление
      const newWorker = this.state.swRegistration.waiting;
      if (newWorker) {
        newWorker.postMessage({ type: 'SKIP_WAITING' });
      }

      // Перезагружаем страницу
      window.location.reload();

    } catch (error) {
      console.error('❌ Ошибка обновления:', error);
      this.showNotification('Ошибка при обновлении', 'error');
    }
  },

  // ===== СТАТУС СЕТИ =====

  // Проверка онлайн статуса
  checkOnlineStatus() {
    this.updateOnlineStatus();
  },

  // Обновление индикатора онлайн статуса
  updateOnlineStatus() {
    if (!this.elements.offlineIndicator) return;

    if (this.state.isOnline) {
      this.elements.offlineIndicator.classList.add('hidden');
      this.elements.offlineIndicator.classList.remove('visible');
    } else {
      this.elements.offlineIndicator.classList.remove('hidden');
      this.elements.offlineIndicator.classList.add('visible');
    }

    // Обновляем CSS класс на body
    document.body.classList.toggle('offline', !this.state.isOnline);
    document.body.classList.toggle('online', this.state.isOnline);
  },

  // ===== КЭШИРОВАНИЕ =====

  // Проверка статуса кэша
  async checkCacheStatus() {
    try {
      const cacheInfo = await this.getCacheInfo();
      console.log('📦 Информация о кэше:', cacheInfo);
      
      // Уведомляем о готовности к офлайн работе
      if (Object.keys(cacheInfo).length > 0) {
        this.showNotification('Сайт готов к работе в офлайн режиме', 'success');
      }
    } catch (error) {
      console.error('❌ Ошибка проверки кэша:', error);
    }
  },

  // Получение информации о кэше
  async getCacheInfo() {
    if (!this.state.swRegistration) return {};

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        if (event.data.type === 'CACHE_INFO') {
          resolve(event.data.payload);
        }
      };

      this.state.swRegistration.active.postMessage(
        { type: 'GET_CACHE_INFO' },
        [messageChannel.port2]
      );
    });
  },

  // Очистка кэша
  async clearCache() {
    if (!this.state.swRegistration) return;

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        if (event.data.type === 'CACHE_CLEARED') {
          resolve();
        }
      };

      this.state.swRegistration.active.postMessage(
        { type: 'CLEAR_CACHE' },
        [messageChannel.port2]
      );
    });
  },

  // Кэширование текущей страницы
  cacheCurrentPage() {
    if (!this.state.swRegistration) return;

    this.state.swRegistration.active.postMessage({
      type: 'CACHE_PAGE',
      payload: { url: window.location.href }
    });
  },

  // ===== УВЕДОМЛЕНИЯ =====

  // Показать уведомление
  showNotification(message, type = 'info', options = {}) {
    const notification = document.createElement('div');
    notification.className = `pwa-notification pwa-notification--${type}`;
    
    if (options.persistent) {
      notification.classList.add('persistent');
    }

    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${this.getNotificationIcon(type)}</span>
        <span class="notification-message">${message}</span>
        ${options.action ? `
          <button class="notification-action">${options.action.text}</button>
        ` : ''}
        <button class="notification-close">×</button>
      </div>
    `;

    document.body.appendChild(notification);

    // Анимация появления
    setTimeout(() => {
      notification.classList.add('visible');
    }, 100);

    // Обработчики событий
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      this.hideNotification(notification);
    });

    if (options.action) {
      const actionBtn = notification.querySelector('.notification-action');
      actionBtn.addEventListener('click', () => {
        options.action.callback();
        this.hideNotification(notification);
      });
    }

    // Автоматическое скрытие
    if (!options.persistent) {
      setTimeout(() => {
        this.hideNotification(notification);
      }, 5000);
    }

    return notification;
  },

  // Скрыть уведомление
  hideNotification(notification) {
    notification.classList.remove('visible');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  },

  // Получить иконку для уведомления
  getNotificationIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || icons.info;
  },

  // ===== АНАЛИТИКА =====

  // Отслеживание событий PWA
  trackEvent(eventName, data = {}) {
    console.log('📊 PWA Event:', eventName, data);
    
    // Здесь можно добавить интеграцию с аналитикой
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'PWA',
        ...data
      });
    }
  },

  // ===== УТИЛИТЫ =====

  // Проверка, установлено ли приложение
  async isAppInstalled() {
    if ('getInstalledRelatedApps' in navigator) {
      try {
        const relatedApps = await navigator.getInstalledRelatedApps();
        return relatedApps.length > 0;
      } catch (error) {
        console.warn('Не удалось проверить установленные приложения:', error);
      }
    }
    
    // Fallback проверка
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
  },

  // Получение информации о PWA
  getInfo() {
    return {
      ...this.state,
      support: this.detectPWASupport(),
      isStandalone: window.matchMedia('(display-mode: standalone)').matches
    };
  }
};

// Автоматическая инициализация при загрузке DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    PWA.init();
  });
} else {
  PWA.init();
}

// Экспорт для использования в других модулях
window.PWA = PWA;
