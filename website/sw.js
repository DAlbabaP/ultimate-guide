// ===== SERVICE WORKER ДЛЯ PWA ФУНКЦИОНАЛЬНОСТИ =====

const CACHE_NAME = 'rgau-guide-v1.2.0';
const STATIC_CACHE_NAME = 'rgau-guide-static-v1.2.0';
const DATA_CACHE_NAME = 'rgau-guide-data-v1.2.0';

// Файлы для кэширования при установке
const STATIC_FILES = [
  './',
  './index.html',
  './manifest.json',
  
  // CSS файлы
  './css/styles.css',
  './css/header.css',
  './css/footer.css',
  './css/navigation.css',
  './css/cards.css',
  './css/timeline.css',
  './css/homepage.css',
  './css/pages.css',
  './css/responsive.css',
  './css/header-search.css',
  './css/pwa.css',
  
  // JavaScript файлы
  './js/main.js',
  './js/utils.js',
  './js/navigation.js',
  './js/search.js',
  './js/search-modal.js',
  './js/animations.js',
  './js/timeline.js',
  './js/important-dates.js',
  './js/university-quiz.js',
  './js/seo-utils.js',
  './js/pwa.js',
  './js/data.js',
  
  // Компоненты
  './components/header.html',
  './components/footer.html',
  './components/search.html',
  
  // Основные страницы
  './pages/applicant-path/',
  './pages/applicant-path/index.html',
  './pages/university-life/',
  './pages/university-life/index.html',
  './pages/scholarships/',
  './pages/scholarships/index.html',
  './pages/organizations/',
  './pages/organizations/index.html',
  './pages/military/',
  './pages/military/index.html',
  './pages/self-government/',
  './pages/self-government/index.html',
  './pages/support/',
  './pages/support/index.html',
  
  // Данные
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
      // Кэширование статических файлов
      caches.open(STATIC_CACHE_NAME).then(cache => {
        console.log('📦 Кэширование статических файлов...');
        return cache.addAll(STATIC_FILES.map(url => new Request(url, {
          cache: 'reload'
        })));
      }),
      
      // Создание кэша для данных
      caches.open(DATA_CACHE_NAME),
      
      // Пропуск ожидания
      self.skipWaiting()
    ])
  );
});

// ===== АКТИВАЦИЯ SERVICE WORKER =====
self.addEventListener('activate', event => {
  console.log('✅ Service Worker: Активация...');
  
  event.waitUntil(
    Promise.all([
      // Очистка старых кэшей
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DATA_CACHE_NAME && 
                cacheName !== CACHE_NAME) {
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
});

// ===== ОБРАБОТКА FETCH ЗАПРОСОВ =====
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Игнорируем chrome-extension и не-HTTP запросы
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Обработка запросов к API и данным
  if (url.pathname.includes('/data/') || url.pathname.includes('/api/')) {
    event.respondWith(handleDataRequest(request));
    return;
  }
  
  // Обработка HTML страниц
  if (request.destination === 'document') {
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
  try {
    // Сначала пытаемся загрузить из сети
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Кэшируем успешный ответ
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('🌐 Сеть недоступна, загрузка из кэша...');
  }
  
  // Если сеть недоступна, загружаем из кэша
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
    // Если страницы нет в кэше, показываем офлайн страницу
  return caches.match('./pages/offline.html') || 
         new Response('Страница недоступна в офлайн режиме', {
           status: 503,
           statusText: 'Service Unavailable'
         });
}

// Обработка статических ресурсов
async function handleStaticRequest(request) {
  // Cache First стратегия для статических файлов
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
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
  
  // Асинхронно обновляем кэш
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      const cache = caches.open(CACHE_NAME);
      cache.then(c => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch(error => {
    console.log('❌ Ошибка сети:', error);
    return null;
  });
  
  // Возвращаем кэшированную версию, если есть
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Если кэша нет, ждем сетевой запрос
  try {
    return await fetchPromise;
  } catch (error) {
    return new Response('Ресурс недоступен', { status: 503 });
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

// Логирование версии Service Worker
console.log('🚀 Service Worker РГАУ-МСХА Guide запущен, версия:', CACHE_NAME);
