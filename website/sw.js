// ===== SERVICE WORKER ДЛЯ PWA ФУНКЦИОНАЛЬНОСТИ =====

// Обновляем версии кешей при каждом изменении
const CACHE_VERSION = '1.9.0'; // Увеличиваем версию при каждом изменении кэша
const CACHE_NAME = `rgau-guide-v${CACHE_VERSION}`;
const STATIC_CACHE_NAME = `rgau-guide-static-v${CACHE_VERSION}`;
const DATA_CACHE_NAME = `rgau-guide-data-v${CACHE_VERSION}`;

// Файлы для кэширования при установке (критически важные для всех страниц)
const STATIC_FILES = [
  './',
  './index.html',
  './manifest.json',
  '/website/',
  '/website/index.html', 
  '/website/manifest.json',
  
  // Все основные CSS файлы (необходимые для большинства страниц)
  './css/styles.css',
  './css/header.css',
  './css/footer.css',
  './css/navigation.css',
  './css/homepage.css',
  './css/responsive.css',
  './css/pwa.css',
  './css/cards.css',
  './css/timeline.css',
  './css/pages.css',
  './css/forms.css',
  
  // Все основные JavaScript файлы
  './js/main.js',
  './js/utils.js',
  './js/navigation.js',
  './js/search.js',
  './js/search-modal.js',
  './js/pwa.js',
  './js/animations.js',
  './js/seo-utils.js',
  
  // Компоненты
  './components/header.html',
  './components/footer.html',
  './components/search.html',
  
  // Основные данные
  './data/content.json',
  './data/search-index.json',
  
  // Офлайн страница
  './pages/offline.html'
];

// Динамические файлы для кэширования по запросу
const DYNAMIC_CACHE_PATTERNS = [
  /^\/pages\/.+\.html$/,
  /^\/css\/.+\.css$/,
  /^\/js\/.+\.js$/,
  /^\/images\/.+\.(png|jpg|jpeg|svg|webp|gif)$/,
  /^\/data\/.+\.json$/
];

// Стратегии кэширования
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
};

// ===== УСТАНОВКА SERVICE WORKER =====
self.addEventListener('install', event => {
  console.log('🔧 Service Worker: Установка...');
  
  event.waitUntil(
    Promise.all([
      // Кэширование статических файлов с проверкой доступности
      caches.open(STATIC_CACHE_NAME).then(async cache => {
        console.log('📦 Кэширование статических файлов...');
        
        const cachePromises = STATIC_FILES.map(async url => {
          try {
            const request = new Request(url, { cache: 'reload' });
            const response = await fetch(request);
            
            if (response.ok) {
              await cache.put(request, response);
              console.log('✅ Кэширован:', url);
            } else {
              console.warn('⚠️ Пропущен (недоступен):', url, response.status);
            }
          } catch (error) {
            console.warn('⚠️ Пропущен (ошибка):', url, error.message);
          }
        });
        
        await Promise.all(cachePromises);
        console.log('📦 Кэширование статических файлов завершено');
      }),      // Создание кэша для данных
      caches.open(DATA_CACHE_NAME),
      
      // Пропуск ожидания
      self.skipWaiting()
    ]).then(() => {
      console.log('✅ SW установлен, начинаем фоновое кэширование...');
      // Запускаем фоновое кэширование дополнительных ресурсов
      backgroundCacheRemaining();
    })
  );
});

// ===== АКТИВАЦИЯ SERVICE WORKER =====
self.addEventListener('activate', event => {
  console.log('✅ Service Worker: Активация...');
  
  event.waitUntil(
    Promise.all([
      // Очистка старых кэшей
      caches.keys().then(cacheNames => {
        const currentCaches = [STATIC_CACHE_NAME, DATA_CACHE_NAME, CACHE_NAME];
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!currentCaches.includes(cacheName)) {
              console.log('🗑️ Удаление старого кэша:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Захват всех клиентов
      self.clients.claim()
    ])
  );
  
  console.log('🎯 Service Worker активирован и готов к работе');
});

// ===== ОБРАБОТКА FETCH ЗАПРОСОВ =====
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  console.log('🔍 SW Fetch запрос:', url.pathname, 'destination:', request.destination);
  
  // Игнорируем chrome-extension и не-HTTP запросы
  if (!url.protocol.startsWith('http')) {
    console.log('⚠️ Игнорируем не-HTTP запрос:', url.protocol);
    return;
  }
  
  // Игнорируем WebSocket запросы и DevTools
  if (url.pathname.includes('/ws') || url.pathname.includes('__vscode_')) {
    console.log('⚠️ Игнорируем WS/DevTools запрос:', url.pathname);
    return;
  }  // Перенаправляем неправильные запросы к ресурсам из страниц
  if (url.pathname.startsWith('/website/pages/')) {
    // Исправляем пути к ресурсам, которые запрашиваются из подстраниц
    if (url.pathname.includes('/website/pages/manifest.json')) {
      console.log('⚠️ Перенаправляем запрос к manifest:', url.pathname, '→ /website/manifest.json');
      const manifestUrl = new URL('/website/manifest.json', url.origin);
      const manifestRequest = new Request(manifestUrl, { 
        method: request.method,
        headers: request.headers,
        mode: request.mode,
        credentials: request.credentials,
        cache: request.cache,
        redirect: request.redirect
      });
      event.respondWith(handleStaticRequest(manifestRequest));
      return;
    }
    
    // Исправляем пути к изображениям, CSS, JS
    if (url.pathname.includes('/website/pages/images/') || 
        url.pathname.includes('/website/pages/css/') || 
        url.pathname.includes('/website/pages/js/')) {
      const correctPath = url.pathname.replace('/website/pages/', '/website/');
      console.log('⚠️ Перенаправляем запрос к ресурсу:', url.pathname, '→', correctPath);
      const correctUrl = new URL(correctPath, url.origin);
      const correctRequest = new Request(correctUrl, {
        method: request.method,
        headers: request.headers,
        mode: request.mode,
        credentials: request.credentials,
        cache: request.cache,
        redirect: request.redirect
      });
      event.respondWith(handleStaticRequest(correctRequest));
      return;
    }
  }
  
  // Обработка запросов к API и данным
  if (url.pathname.includes('/data/') || url.pathname.includes('/api/')) {
    event.respondWith(handleDataRequest(request));
    return;
  }
  // Обработка HTML страниц
  if (request.destination === 'document' || 
      (request.method === 'GET' && request.headers.get('accept')?.includes('text/html')) ||
      url.pathname.endsWith('/') || 
      url.pathname.endsWith('.html')) {
    console.log('📄 Обрабатываем HTML документ:', url.pathname);
    event.respondWith(handleDocumentRequest(request));
    return;
  }
  
  // Обработка статических ресурсов
  if (request.destination === 'style' || 
      request.destination === 'script' || 
      request.destination === 'image') {
    event.respondWith(handleStaticRequest(request));
    return;
  }
  
  // Обработка остальных запросов
  event.respondWith(handleGenericRequest(request));
});

// ===== СТРАТЕГИИ КЭШИРОВАНИЯ =====

// Обработка документов (HTML страниц)
async function handleDocumentRequest(request) {
  const url = new URL(request.url);
  
  // Сначала пробуем загрузить из сети
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Кэшируем успешный ответ
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
      // Если получили ошибку 404/500, но сеть есть - возвращаем ошибку
    if (networkResponse.status >= 400) {
      return networkResponse;
    }
    
  } catch (error) {
    console.log('🌐 Сеть недоступна для:', url.pathname);
    
    // Проверяем кэш
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('📦 Загружено из кэша:', url.pathname);
      return cachedResponse;
    }
    
    // Если это запрос к конкретной странице в /pages/, показываем офлайн
    if (url.pathname.includes('/pages/')) {
      console.log('📡 Показываем офлайн страницу для:', url.pathname);
      const offlinePage = await caches.match('./pages/offline.html');
      if (offlinePage) {
        return offlinePage;
      }
      return new Response('Страница недоступна в офлайн режиме', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
  }
  
  // Для остальных случаев пробуем кэш
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Последний fallback - пытаемся загрузить главную страницу
  try {
    const indexResponse = await caches.match('./index.html');
    if (indexResponse) {
      return indexResponse;
    }
  } catch (error) {
    // ignore
  }
  
  return new Response('Страница не найдена', { status: 404 });
}

// Обработка статических ресурсов
async function handleStaticRequest(request) {
  const url = new URL(request.url);
  
  // Для критически важных файлов (JS, CSS компонентов) используем Network First
  const isCriticalFile = url.pathname.includes('/components/') || 
                         url.pathname.includes('/js/navigation.js') ||
                         url.pathname.includes('/js/main.js') ||
                         url.pathname.includes('/js/utils.js') ||
                         url.pathname.includes('/css/navigation.css') ||
                         url.pathname.includes('/css/header.css');
  
  if (isCriticalFile) {
    try {
      // Network First для критических файлов
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        const cache = await caches.open(STATIC_CACHE_NAME);
        cache.put(request, networkResponse.clone());
        console.log('🔄 Критический файл обновлен из сети:', url.pathname);
        return networkResponse;
      }
    } catch (error) {
      console.log('🌐 Сеть недоступна для критического файла, используем кеш:', url.pathname);
    }
  }
  
  // Cache First стратегия для остальных статических файлов
  const cachedResponse = await caches.match(request);
  if (cachedResponse && !isCriticalFile) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('❌ Ошибка загрузки статического ресурса:', request.url);
  }
  
  // Если есть кешированная версия критического файла, используем её
  if (isCriticalFile && cachedResponse) {
    console.log('📦 Используем кешированную версию критического файла:', url.pathname);
    return cachedResponse;
  }
  
  // Fallback для CSS файлов - возвращаем пустой CSS
  if (request.destination === 'style' || request.url.endsWith('.css')) {
    return new Response('/* CSS файл недоступен в офлайн режиме */', {
      headers: { 'Content-Type': 'text/css' },
      status: 200
    });
  }
  
  // Fallback для JS файлов - возвращаем пустой скрипт
  if (request.destination === 'script' || request.url.endsWith('.js')) {
    return new Response('console.log("JS файл недоступен в офлайн режиме");', {
      headers: { 'Content-Type': 'application/javascript' },
      status: 200
    });
  }
  
  // Fallback для изображений
  if (request.destination === 'image') {
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">' +
      '<rect width="100" height="100" fill="#f0f0f0"/>' +
      '<text x="50" y="50" text-anchor="middle" dy="0.3em" font-family="Arial" font-size="12" fill="#999">' +
      'Изображение недоступно' +
      '</text></svg>',
      { 
        headers: { 'Content-Type': 'image/svg+xml' },
        status: 200
      }
    );
  }
  
  return new Response('Ресурс недоступен', { status: 404 });
}

// Обработка данных и API запросов
async function handleDataRequest(request) {
  try {
    // Network First стратегия для данных
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DATA_CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('🌐 Сеть недоступна для данных, загрузка из кэша...');
  }
  
  // Если сеть недоступна, загружаем из кэша
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Fallback для JSON данных
  if (request.url.includes('.json')) {
    return new Response(JSON.stringify({
      error: 'Данные недоступны в офлайн режиме',
      offline: true,
      timestamp: Date.now()
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  }
  
  return new Response('Данные недоступны', { status: 503 });
}

// Обработка общих запросов
async function handleGenericRequest(request) {
  // Stale While Revalidate стратегия
  const cachedResponse = await caches.match(request);
  
  try {
    // Попытка сетевого запроса
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Асинхронно обновляем кэш
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    // Если сетевой запрос неуспешен, возвращаем кэш или fallback
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response('Ресурс недоступен', { status: networkResponse.status });
    
  } catch (error) {
    console.log('❌ Ошибка сети для:', request.url);
    
    // Возвращаем кэшированную версию, если есть
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Если кэша нет, возвращаем ошибку
    return new Response('Ресурс недоступен в офлайн режиме', { status: 503 });
  }
}

// ===== ДОПОЛНИТЕЛЬНЫЕ СОБЫТИЯ =====

// Обработка сообщений от клиента
self.addEventListener('message', event => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_CACHE_INFO':
      getCacheInfo().then(info => {
        event.ports[0].postMessage({ type: 'CACHE_INFO', payload: info });
      });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
      });
      break;
      
    case 'CACHE_PAGE':
      if (payload && payload.url) {
        cachePage(payload.url);
      }
      break;
  }
});

// Получение информации о кэше
async function getCacheInfo() {
  const cacheNames = await caches.keys();
  const info = {};
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    info[cacheName] = {
      count: keys.length,
      urls: keys.map(request => request.url)
    };
  }
  
  return info;
}

// Очистка всех кэшей
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
}

// Кэширование отдельной страницы
async function cachePage(url) {
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.add(url);
    console.log('✅ Страница закэширована:', url);
  } catch (error) {
    console.error('❌ Ошибка кэширования страницы:', url, error);
  }
}

// Периодическая синхронизация (если поддерживается)
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(performBackgroundSync());
  }
});

async function performBackgroundSync() {
  console.log('🔄 Выполнение фоновой синхронизации...');
  
  // Здесь можно добавить логику для синхронизации данных
  // Например, обновление кэша важных страниц
  const importantPages = [
    '/',
    '/pages/applicant-path/',
    '/pages/university-life/',
    '/pages/scholarships/'
  ];
  
  for (const page of importantPages) {
    try {
      await cachePage(page);
    } catch (error) {
      console.error('Ошибка синхронизации страницы:', page, error);
    }
  }
}

// ===== ФОНОВОЕ КЭШИРОВАНИЕ =====
async function backgroundCacheRemaining() {
  console.log('🔄 Начинаем фоновое кэширование дополнительных ресурсов...');
  
  // Уведомляем клиентов о начале кэширования
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({ type: 'BACKGROUND_CACHE_START' });
  });  // Дополнительные ресурсы для полного офлайн-режима
  const additionalResources = [
    // Остальные CSS файлы для всех страниц
    './css/university-life.css',
    './css/dormitory.css',
    './css/dormitory-settlement.css', 
    './css/academic-process.css',
    './css/infrastructure.css',
    './css/infrastructure-map.css',
    './css/scholarships.css',
    './css/standard-scholarship.css',
    './css/enhanced-scholarship.css',
    './css/other-benefits.css',
    './css/moscow-card.css',
    './css/military.css',
    './css/deferment.css',
    './css/vuc.css',
    './css/military-office.css',
    './css/self-government.css',
    './css/leader-requirements.css',
    './css/responsibilities.css',
    './css/adaptation.css',
    './css/enrollment.css',
    './css/faq.css',
    './css/header-search.css',
    
    // Остальные JS файлы
    './js/timeline.js',
    './js/data.js',
    './js/important-dates.js',
    './js/university-quiz.js',
    './js/scholarship-calculator.js',
    './js/dormitory-guide.js',
    './js/infrastructure-map.js',
      // Все основные HTML страницы (с правильными путями)
    '/website/pages/applicant-path/',
    '/website/pages/applicant-path/index.html',
    '/website/pages/applicant-path/enrollment/',
    '/website/pages/applicant-path/enrollment/index.html',
    '/website/pages/applicant-path/adaptation/',
    '/website/pages/applicant-path/adaptation/index.html',
    '/website/pages/applicant-path/competitive-selection/',
    '/website/pages/applicant-path/competitive-selection/index.html',
    '/website/pages/applicant-path/dormitory-settlement/',
    '/website/pages/applicant-path/dormitory-settlement/index.html',
    '/website/pages/applicant-path/documents/',
    '/website/pages/applicant-path/documents/index.html',
    '/website/pages/university-life/',
    '/website/pages/university-life/index.html',
    '/website/pages/university-life/infrastructure/',
    '/website/pages/university-life/infrastructure/index.html',
    '/website/pages/university-life/dormitory/',
    '/website/pages/university-life/dormitory/index.html',
    '/website/pages/university-life/academic-process/',
    '/website/pages/university-life/academic-process/index.html',
    '/website/pages/scholarships/',
    '/website/pages/scholarships/index.html',
    '/website/pages/scholarships/standard/',
    '/website/pages/scholarships/standard/index.html',
    '/website/pages/scholarships/enhanced/',
    '/website/pages/scholarships/enhanced/index.html',
    '/website/pages/scholarships/other-benefits/',
    '/website/pages/scholarships/other-benefits/index.html',
    '/website/pages/scholarships/moscow-card/',
    '/website/pages/scholarships/moscow-card/index.html',
    '/website/pages/military/',
    '/website/pages/military/index.html',
    '/website/pages/military/deferment/',
    '/website/pages/military/deferment/index.html',
    '/website/pages/military/vuc/',
    '/website/pages/military/vuc/index.html',
    '/website/pages/military/military-office/',
    '/website/pages/military/military-office/index.html',
    '/website/pages/self-government/',
    '/website/pages/self-government/index.html',
    '/website/pages/self-government/leader-requirements/',
    '/website/pages/self-government/leader-requirements/index.html',
    '/website/pages/self-government/responsibilities/',
    '/website/pages/self-government/responsibilities/index.html',
    '/website/pages/support/faq/',
    '/website/pages/support/faq/index.html'
  ];
  
  const cache = await caches.open(STATIC_CACHE_NAME);
  let cached = 0;
  
  // Кэшируем по одному файлу с интервалом
  for (const resource of additionalResources) {
    try {
      const response = await fetch(resource);
      if (response.ok) {
        await cache.put(resource, response);
        cached++;
        console.log('📦 Фоново кэширован:', resource, `(${cached}/${additionalResources.length})`);
        
        // Отправляем прогресс клиентам
        clients.forEach(client => {
          client.postMessage({ 
            type: 'CACHE_PROGRESS', 
            payload: { cached, total: additionalResources.length, current: resource }
          });
        });
      }
    } catch (error) {
      console.log('⚠️ Не удалось кэшировать:', resource);
    }
    
    // Небольшая пауза между запросами
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Уведомляем о завершении
  clients.forEach(client => {
    client.postMessage({ type: 'CACHE_COMPLETE' });
  });
  
  console.log(`✅ Фоновое кэширование завершено: ${cached}/${additionalResources.length} файлов`);
}

// Логирование версии Service Worker
console.log('🚀 Service Worker РГАУ-МСХА Guide запущен, версия:', CACHE_NAME);
