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
    updateAvailable: false,
    isIOS: false,
    isAndroid: false,
    isStandalone: false
  },

  // Элементы интерфейса
  elements: {
    installButton: null,
    updateButton: null,
    offlineIndicator: null,
    installBanner: null
  },  // ===== ИНИЦИАЛИЗАЦИЯ =====
  async init() {
    console.log('📱 Инициализация PWA модуля...');
    
    this.detectPlatform();
    this.detectPWASupport();
    this.initializeElements();
    this.handleSWMessages(); // Добавляем обработку сообщений от SW
    await this.registerServiceWorker();
    
    // Принудительная активация SW если нужно
    const swActivated = await forceActivateSW();
    if (!swActivated) {
      console.warn('⚠️ SW не был активирован, попробуйте перезагрузить страницу');
    }
    
    this.bindEvents();
    this.checkOnlineStatus();
    this.createInstallBanner();
    this.scheduleInstallPrompt();
    
    console.log('✅ PWA модуль инициализирован');
  },
  // Определение платформы
  detectPlatform() {
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Проверяем реальную iOS (не эмуляцию)
    this.state.isIOS = /iphone|ipad|ipod/.test(userAgent) && 
                       !userAgent.includes('edg/') && // Не Edge на Windows
                       !userAgent.includes('chrome/'); // Не Chrome девтулсы
    
    this.state.isAndroid = /android/.test(userAgent) && 
                          !userAgent.includes('edg/');
    
    this.state.isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                             window.navigator.standalone === true;
    
    console.log('🔍 Платформа:', {
      iOS: this.state.isIOS,
      Android: this.state.isAndroid,
      Standalone: this.state.isStandalone,
      UserAgent: userAgent
    });
  },

  // Планирование показа баннера установки
  scheduleInstallPrompt() {
    if (this.state.isStandalone) return;

    if (this.state.isIOS) {
      // iOS: показываем через 3 секунды
      setTimeout(() => this.showIOSInstallInstructions(), 3000);
    } else {
      // Android/Desktop: показываем через 5 секунд если нет deferredPrompt
      setTimeout(() => {
        if (!this.state.deferredPrompt) {
          this.showInstallPrompt();
        }
      }, 5000);
    }
  },

  // Инструкции для iOS
  showIOSInstallInstructions() {
    if (this.state.isStandalone) return;
    
    const banner = this.elements.installBanner;
    if (banner) {
      const title = banner.querySelector('.install-banner-title');
      const description = banner.querySelector('.install-banner-description');
      const installBtn = banner.querySelector('.install-btn-primary');

      if (title) title.textContent = 'Добавить на экран «Домой»';
      if (description) {
        description.innerHTML = 'Нажмите <strong>⎙</strong> (Поделиться) внизу экрана, затем выберите <strong>«Добавить на экран «Домой»»</strong>';
      }
      if (installBtn) {
        installBtn.textContent = 'Понятно';
      }
    }
    
    this.showInstallPrompt();
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
  },  // ===== РЕГИСТРАЦИЯ SERVICE WORKER =====
  async registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      console.warn('⚠️ Service Worker не поддерживается');
      return;
    }

    try {
      // Сначала проверим существующую регистрацию
      const existingRegistration = await navigator.serviceWorker.getRegistration();
      if (existingRegistration) {
        console.log('🔄 Используем существующую регистрацию SW');
        this.state.swRegistration = existingRegistration;
        this.setupSWHandlers(existingRegistration);
        return;
      }

      console.log('🔄 Регистрация нового Service Worker по пути:', this.config.swPath);
      const registration = await navigator.serviceWorker.register(this.config.swPath, {
        scope: './'
      });
      
      this.state.swRegistration = registration;
      console.log('✅ Service Worker зарегистрирован:', registration);
      
      this.setupSWHandlers(registration);

    } catch (error) {
      console.error('❌ Ошибка регистрации Service Worker:', error);
      console.error('Путь к SW файлу:', this.config.swPath);
      console.error('Текущий URL:', window.location.href);
    }
  },

  // Настройка обработчиков для SW
  setupSWHandlers(registration) {
    // Проверка обновлений
    registration.addEventListener('updatefound', () => {
      this.handleSWUpdate(registration);
    });

    // Проверка активного Service Worker
    if (registration.active) {
      this.handleSWActivated();
    }

    // Ждем активации если SW еще не активен
    if (registration.installing) {
      registration.installing.addEventListener('statechange', (e) => {
        if (e.target.state === 'activated') {
          this.handleSWActivated();
        }
      });
    }

    // Обработка сообщений от SW
    this.handleSWMessages();
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

  // Обработка сообщений от Service Worker
  handleSWMessages() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        const { type, payload } = event.data;
        
        switch (type) {
          case 'CACHE_PROGRESS':
            this.showCacheProgress(payload);
            break;
          case 'CACHE_COMPLETE':
            this.showCacheComplete();
            break;
          case 'BACKGROUND_CACHE_START':
            this.showBackgroundCacheStart();
            break;
        }
      });
    }
  },

  // Показать начало фонового кэширования
  showBackgroundCacheStart() {
    console.log('📦 Начинается фоновое кэширование для офлайн-режима...');
    
    // Создаем незаметное уведомление
    const notification = document.createElement('div');
    notification.id = 'cache-notification';
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
    `;
    notification.innerHTML = '📦 Подготовка к офлайн-режиму...';
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0)';
    }, 100);
    
    // Скрываем через 3 секунды
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(20px)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  },
  // Показать завершение кэширования (отключено)
  showCacheComplete() {    console.log('✅ Офлайн-режим готов!');
    // Уведомления отключены
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
    });    // Изменение статуса сети
    window.addEventListener('online', () => {
      this.state.isOnline = true;
      this.updateOnlineStatus();
      // this.showNotification('Соединение восстановлено', 'info');
    });

    window.addEventListener('offline', () => {
      this.state.isOnline = false;
      this.updateOnlineStatus();
      // this.showNotification('Переход в офлайн режим', 'warning');
    });

    // Кнопки установки и обновления
    this.bindButtonEvents();
  },
  // Привязка событий кнопок
  bindButtonEvents() {
    // Используем делегирование событий для динамически созданных элементов
    document.addEventListener('click', (e) => {
      if (e.target.id === 'install-app-btn' || e.target.closest('#install-app-btn')) {
        e.preventDefault();
        this.installApp();
      }
      
      if (e.target.id === 'close-install-banner' || e.target.closest('#close-install-banner')) {
        e.preventDefault();
        this.hideInstallPrompt();
      }
      
      if (e.target.id === 'pwa-update-btn' || e.target.closest('#pwa-update-btn')) {
        e.preventDefault();
        this.updateApp();
      }
    });
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

  // Установка приложения  // Установка приложения
  async installApp() {
    console.log('📱 Попытка установки PWA...');

    if (this.state.isIOS) {
      // Для iOS просто скрываем баннер, так как это инструкции
      this.hideInstallPrompt();
      return;
    }

    if (!this.state.deferredPrompt) {
      console.log('⚠️ deferredPrompt недоступен, показываем инструкции');
      this.showManualInstallInstructions();
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
      this.showManualInstallInstructions();
    }
  },

  // Инструкции по ручной установке
  showManualInstallInstructions() {
    let message = 'Для установки приложения:\n\n';
    
    if (this.state.isAndroid) {
      message += '1. Откройте меню браузера (⋮)\n';
      message += '2. Выберите "Добавить на главный экран"';
    } else {
      message += '1. Откройте меню браузера\n';
      message += '2. Найдите опцию "Установить приложение"';
    }
    
    alert(message);
    this.hideInstallPrompt();
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
    this.state.isOnline = navigator.onLine;
    this.updateOnlineStatus();
    console.log('🌐 Статус сети обновлен:', this.state.isOnline ? 'Онлайн' : 'Офлайн');
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
        // Уведомляем о готовности к офлайн работе (отключено)
      if (Object.keys(cacheInfo).length > 0) {
        // this.showNotification('Сайт готов к работе в офлайн режиме', 'success');
        console.log('✅ Сайт готов к работе в офлайн режиме');
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
  },
  // ===== ДИАГНОСТИКА =====
  async diagnose() {
    console.log('🔍 Диагностика PWA...');
    
    // Принудительно обновляем статус сети
    this.checkOnlineStatus();
    
    // Проверяем активацию SW - НЕ пытаемся автоматически исправить
    if (this.state.swRegistration && !this.state.swRegistration.active) {
      console.log('⚠️ SW не активен, попробуйте forceActivateSW() для исправления');
    }
    
    const info = {
      serviceWorker: {
        supported: 'serviceWorker' in navigator,
        registered: !!this.state.swRegistration,
        active: !!(this.state.swRegistration && this.state.swRegistration.active),
        installing: !!(this.state.swRegistration && this.state.swRegistration.installing),
        waiting: !!(this.state.swRegistration && this.state.swRegistration.waiting),
        scope: this.state.swRegistration ? this.state.swRegistration.scope : null,
        state: this.state.swRegistration ? this.state.swRegistration.active?.state : null,
        updateViaCache: this.state.swRegistration ? this.state.swRegistration.updateViaCache : null
      },
      caches: await caches.keys(),
      manifest: !!document.querySelector('link[rel="manifest"]'),
      standalone: this.state.isStandalone,
      platform: {
        isIOS: this.state.isIOS,
        isAndroid: this.state.isAndroid,
        userAgent: navigator.userAgent.substring(0, 100) + '...'
      },
      network: this.state.isOnline,
      installPrompt: {
        hasPrompt: !!this.state.deferredPrompt,
        bannerVisible: this.elements.installBanner && !this.elements.installBanner.classList.contains('hidden')
      }
    };
    
    console.log('🔍 Полная диагностика PWA:');
    console.table(info.serviceWorker);
    console.log('📦 Кэши:', info.caches);
    console.log('📱 Платформа:', info.platform);
    console.log('🌐 Сеть:', info.network ? 'Онлайн' : 'Офлайн');
    console.log('⬇️ Установка:', info.installPrompt);
    
    // Дополнительные проверки
    if (info.caches.length === 0) {
      console.warn('⚠️ Нет кэшей - возможно SW не работает');
    }
    
    if (info.serviceWorker.registered && !info.serviceWorker.active) {
      console.warn('⚠️ SW зарегистрирован, но не активен');
      if (info.serviceWorker.installing) {
        console.log('⏳ SW устанавливается...');
      }
      if (info.serviceWorker.waiting) {
        console.log('⏸️ SW ожидает активации');
      }
    }
    
    if (info.serviceWorker.active && info.caches.length > 3) {
      console.warn('⚠️ Слишком много кэшей - возможно остались старые версии');
    }
    
    return info;
  },
};

// Функция очистки старых SW регистраций
async function clearOldServiceWorkers() {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      console.log('🗑️ Удаление старой регистрации SW:', registration.scope);
      await registration.unregister();
    }
  }
}

// Принудительная активация SW
async function forceActivateSW() {
  try {
    // Используем регистрацию из PWA модуля, если она есть
    let registration = PWA.state.swRegistration;
    
    // Если нет в состоянии, получаем напрямую
    if (!registration) {
      registration = await navigator.serviceWorker.getRegistration();
    }
    
    if (!registration) {
      console.log('❌ SW не зарегистрирован, попытка повторной регистрации...');
      try {
        registration = await navigator.serviceWorker.register('./sw.js', { scope: './' });
        PWA.state.swRegistration = registration;
        console.log('✅ SW перерегистрирован');
        
        // Ждем активации нового SW
        return new Promise((resolve) => {
          const checkActivation = () => {
            if (registration.active) {
              console.log('✅ SW активирован после регистрации');
              resolve(true);
            } else if (registration.installing) {
              registration.installing.addEventListener('statechange', () => {
                if (registration.installing.state === 'activated') {
                  console.log('✅ SW активирован после установки');
                  resolve(true);
                }
              }, { once: true });
            } else {
              setTimeout(() => {
                if (registration.active) {
                  resolve(true);
                } else {
                  resolve(false);
                }
              }, 2000);
            }
          };
          checkActivation();
        });
      } catch (error) {
        console.error('❌ Ошибка перерегистрации SW:', error);
        return false;
      }
    }

    // Если есть ожидающий SW
    if (registration.waiting) {
      console.log('⚡ Принудительная активация ожидающего SW...');
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      return new Promise((resolve) => {
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('✅ SW активирован через SKIP_WAITING');
          resolve(true);
        }, { once: true });
        
        setTimeout(() => {
          console.log('⏰ Таймаут активации SW');
          resolve(false);
        }, 5000);
      });
    }    // Если SW устанавливается
    if (registration.installing) {
      console.log('⏳ Ожидание установки SW...');
      return new Promise((resolve) => {
        const installingSW = registration.installing;
        const handleStateChange = () => {
          if (installingSW.state === 'activated') {
            console.log('✅ SW установлен и активирован');
            installingSW.removeEventListener('statechange', handleStateChange);
            resolve(true);
          } else if (installingSW.state === 'redundant') {
            console.log('❌ SW стал избыточным');
            installingSW.removeEventListener('statechange', handleStateChange);
            resolve(false);
          }
        };
        
        installingSW.addEventListener('statechange', handleStateChange);
        
        setTimeout(() => {
          installingSW.removeEventListener('statechange', handleStateChange);
          console.log('⏰ Таймаут установки SW');
          resolve(false);
        }, 10000);
      });
    }

    // Если SW активен
    if (registration.active) {
      console.log('✅ SW уже активен');
      return true;
    }

    // Если SW зарегистрирован, но не активен - НЕ пытаемся обновить, а перерегистрируем
    console.log('🔄 SW зарегистрирован, но не активен. Попытка перерегистрации...');
    
    try {
      // Сначала отменяем регистрацию
      await registration.unregister();
      console.log('🗑️ Старая регистрация отменена');
      
      // Пауза для завершения операции
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Регистрируем заново
      registration = await navigator.serviceWorker.register('./sw.js', { scope: './' });
      PWA.state.swRegistration = registration;
      console.log('📝 SW перерегистрирован');
      
      // Ждем активации
      return new Promise((resolve) => {
        const checkActivation = () => {
          if (registration.active) {
            console.log('✅ SW активирован после перерегистрации');
            resolve(true);
          } else if (registration.installing) {
            registration.installing.addEventListener('statechange', () => {
              if (registration.installing.state === 'activated') {
                console.log('✅ SW активирован после установки');
                resolve(true);
              }
            }, { once: true });
          } else {
            setTimeout(() => {
              if (registration.active) {
                console.log('✅ SW активирован с задержкой');
                resolve(true);
              } else {
                console.log('❌ SW не удалось активировать');
                resolve(false);
              }
            }, 3000);
          }
        };
        
        // Небольшая задержка перед проверкой
        setTimeout(checkActivation, 500);
      });
      
    } catch (error) {
      console.error('❌ Ошибка перерегистрации:', error);
      return false;
    }
  } catch (error) {
    console.error('❌ Ошибка активации SW:', error);
    return false;
  }
}

// Функция полной очистки PWA
async function resetPWA() {
  console.log('🧹 Полная очистка PWA...');
  
  try {
    // 1. Удаляем все Service Workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        console.log('🗑️ Удаление SW:', registration.scope);
        await registration.unregister();
      }
    }
    
    // 2. Очищаем все кэши
    const cacheNames = await caches.keys();
    for (const cacheName of cacheNames) {
      console.log('🗑️ Удаление кэша:', cacheName);
      await caches.delete(cacheName);
    }
    
    console.log('✅ PWA полностью очищено');
    console.log('🔄 Перезагрузите страницу для повторной инициализации');
    
    return true;
  } catch (error) {
    console.error('❌ Ошибка очистки PWA:', error);
    return false;
  }
}

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
window.resetPWA = resetPWA;
window.forceActivateSW = forceActivateSW;
