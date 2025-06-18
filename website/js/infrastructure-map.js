// ===== ИНТЕРАКТИВНАЯ КАРТА ИНФРАСТРУКТУРЫ =====

const InfrastructureMap = {  // База данных объектов инфраструктуры вокруг РГАУ-МСХА
  PLACES: [
    // ТЦ "Байкал" и магазины
    {
      id: 'tc-baikal',
      name: 'ТЦ "Байкал"',
      type: 'shop',
      category: 'Торговый центр',
      distance: 0.5,
      price: 'medium',
      rating: 4.3,
      address: 'остановка «Большая Академическая»',
      hours: '10:00-22:00',
      description: 'Популярный торговый центр с магазинами, KFC и пунктами выдачи',
      coordinates: { lat: 55.8205, lng: 37.5364 }
    },
    {
      id: 'kfc-baikal',
      name: 'KFC (в ТЦ "Байкал")',
      type: 'food',
      category: 'Фастфуд',
      distance: 0.5,
      price: 'medium',
      rating: 4.1,
      address: 'ТЦ "Байкал", остановка «Большая Академическая»',
      hours: '10:00-22:00',
      description: 'Ресторан быстрого питания KFC в торговом центре',
      coordinates: { lat: 55.8205, lng: 37.5364 }
    },
    {
      id: 'lenta-baikal',
      name: 'Лента (в ТЦ "Байкал")',
      type: 'shop',
      category: 'Гипермаркет',
      distance: 0.5,
      price: 'medium',
      rating: 4.2,
      address: 'ТЦ "Байкал", остановка «Большая Академическая»',
      hours: '08:00-24:00',
      description: 'Крупный продуктовый гипермаркет с широким ассортиментом',
      coordinates: { lat: 55.8205, lng: 37.5364 }
    },
    {
      id: 'chizhik-baikal',
      name: 'Чижик (в ТЦ "Байкал")',
      type: 'shop',
      category: 'Продуктовый магазин',
      distance: 0.5,
      price: 'low',
      rating: 4.0,
      address: 'ТЦ "Байкал", остановка «Большая Академическая»',
      hours: '08:00-23:00',
      description: 'Продуктовый магазин с доступными ценами',
      coordinates: { lat: 55.8205, lng: 37.5364 }
    },
    {
      id: 'fixprice-baikal',
      name: 'Фикс Прайс (в ТЦ "Байкал")',
      type: 'shop',
      category: 'Товары для дома',
      distance: 0.5,
      price: 'low',
      rating: 3.9,
      address: 'ТЦ "Байкал", остановка «Большая Академическая»',
      hours: '09:00-22:00',
      description: 'Магазин товаров по фиксированным ценам',
      coordinates: { lat: 55.8205, lng: 37.5364 }
    },
    {
      id: 'diksi',
      name: 'Дикси',
      type: 'shop',
      category: 'Продуктовый магазин',
      distance: 0.8,
      price: 'low',
      rating: 4.0,
      address: 'в сторону МЦК «Коптево»',
      hours: '08:00-23:00',
      description: 'Продуктовый магазин с хорошими ценами и широким ассортиментом',
      coordinates: { lat: 55.8189, lng: 37.5376 }
    },

    // Пункты выдачи
    {
      id: 'ozon-pickup',
      name: 'Пункт выдачи Ozon',
      type: 'service',
      category: 'Доставка',
      distance: 0.5,
      price: 'free',
      rating: 4.2,
      address: 'Большая Академическая ул., 51/1',
      hours: '10:00-21:00',
      description: 'Пункт выдачи заказов интернет-магазина Ozon',
      coordinates: { lat: 55.8201, lng: 37.5372 }
    },
    {
      id: 'wildberries-pickup',
      name: 'Пункт выдачи Wildberries',
      type: 'service',
      category: 'Доставка',
      distance: 0.6,
      price: 'free',
      rating: 4.1,
      address: 'Михалковская ул., 2',
      hours: '09:00-21:00',
      description: 'Пункт выдачи заказов интернет-магазина Wildberries',
      coordinates: { lat: 55.8185, lng: 37.5389 }
    },
    {
      id: 'cdek-pickup',
      name: 'Пункт выдачи CDEK',
      type: 'service',
      category: 'Доставка',
      distance: 0.7,
      price: 'free',
      rating: 4.3,
      address: 'Красностуденческий пр., 7',
      hours: '10:00-20:00',
      description: 'Пункт выдачи службы доставки CDEK',
      coordinates: { lat: 55.8176, lng: 37.5401 }
    },
    {
      id: 'post-office',
      name: 'Почта России',
      type: 'service',
      category: 'Почта',
      distance: 1.2,
      price: 'free',
      rating: 3.5,
      address: 'Дмитровское ш., 17, корп. 2 (отделение № 127434)',
      hours: '08:00-20:00',
      description: 'Отделение почтовой связи № 127434',
      coordinates: { lat: 55.8167, lng: 37.5412 }
    },

    // Спорт
    {
      id: 'gym-dormitory',
      name: 'Спортивный зал у общежития',
      type: 'sport',
      category: 'Тренажерный зал',
      distance: 0.05,
      price: 'medium',
      rating: 4.2,
      address: 'В 50 метрах от общежития',
      hours: '07:00-23:00',
      description: 'Спортивный зал рядом с общежитием. Первый месяц 2500₽, последующие 1750₽',
      coordinates: { lat: 55.8198, lng: 37.5355 }
    },

    // Медицина
    {
      id: 'pediatric-clinic',
      name: 'Детская городская поликлиника № 15',
      type: 'medical',
      category: 'Поликлиника',
      distance: 0.8,
      price: 'free',
      rating: 3.8,
      address: 'улица Всеволода Вишневского, 4А',
      hours: '08:00-20:00',
      description: 'Поликлиника для несовершеннолетних студентов (до 18 лет)',
      coordinates: { lat: 55.8176, lng: 37.5389 }
    },
    {
      id: 'adult-clinic',
      name: 'ГБУЗ ГП № 6, филиал № 3',
      type: 'medical',
      category: 'Поликлиника',
      distance: 0.9,
      price: 'free',
      rating: 3.9,
      address: '3-й Новомихалковский пр., 3А, стр. 1',
      hours: '08:00-20:00',
      description: 'Поликлиника для совершеннолетних студентов (18+ лет)',
      coordinates: { lat: 55.8167, lng: 37.5401 }
    }
  ],

  // Фильтры
  FILTERS: {
    type: 'all',
    distance: 'all',
    price: 'all'
  },

  // Элементы DOM
  elements: {
    container: null,
    mapContainer: null,
    filters: null,
    placesList: null
  },

  // Состояние
  currentView: 'list', // 'list' или 'map'
  filteredPlaces: [],

  // Инициализация
  init() {
    this.findElements();
    this.createFilters();
    this.bindEvents();
    this.filterPlaces();
    this.render();
    console.log('🗺️ Интерактивная карта инфраструктуры инициализирована');
  },
  // Поиск элементов
  findElements() {
    this.elements.container = document.querySelector('.infrastructure-map-container');
    this.elements.mapContainer = document.querySelector('.map-display');
    this.elements.filters = document.querySelector('.filter-buttons');
    this.elements.placesList = document.getElementById('placesList');
  },
  // Создание фильтров
  createFilters() {
    // Фильтры уже созданы в HTML, просто обновляем счетчик
    this.updateResultsCount();
  },
  // Привязка событий
  bindEvents() {
    // Кнопки фильтров
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Убираем активный класс со всех кнопок
        filterButtons.forEach(b => b.classList.remove('active'));
        // Добавляем активный класс к нажатой кнопке
        e.target.closest('.filter-btn').classList.add('active');
        
        // Получаем категорию и применяем фильтр
        const category = e.target.closest('.filter-btn').dataset.category;
        this.FILTERS.type = category === 'all' ? 'all' : this.mapCategoryToType(category);
        this.filterPlaces();
        this.render();
      });
    });
  },

  // Маппинг категорий к типам
  mapCategoryToType(category) {
    const mapping = {
      'shopping': 'shop',
      'food': 'food', 
      'delivery': 'service',
      'sports': 'sport',
      'health': 'medical'
    };
    return mapping[category] || category;
  },

  // Фильтрация мест
  filterPlaces() {
    this.filteredPlaces = this.PLACES.filter(place => {
      // Фильтр по типу
      if (this.FILTERS.type !== 'all' && place.type !== this.FILTERS.type) {
        return false;
      }

      // Фильтр по расстоянию
      if (this.FILTERS.distance !== 'all') {
        const maxDistance = parseFloat(this.FILTERS.distance);
        if (place.distance > maxDistance) {
          return false;
        }
      }

      // Фильтр по цене
      if (this.FILTERS.price !== 'all' && place.price !== this.FILTERS.price) {
        return false;
      }

      return true;
    });

    // Сортировка по расстоянию
    this.filteredPlaces.sort((a, b) => a.distance - b.distance);
  },

  // Сброс фильтров
  resetFilters() {
    this.FILTERS = { type: 'all', distance: 'all', price: 'all' };
    
    document.getElementById('typeFilter').value = 'all';
    document.getElementById('distanceFilter').value = 'all';
    document.getElementById('priceFilter').value = 'all';
    
    this.filterPlaces();
    this.render();
  },

  // Переключение вида
  switchView(view) {
    this.currentView = view;
    
    // Обновление кнопок
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.getElementById(view === 'list' ? 'listViewBtn' : 'mapViewBtn').classList.add('active');
    
    this.render();
  },  // Отрисовка
  render() {
    if (!this.elements.placesList) return;

    // Отображаем и список, и карту одновременно
    this.renderList();
    this.renderMap();
    this.updateResultsCount();
  },

  // Отрисовка списка
  renderList() {
    if (!this.elements.placesList) return;

    if (this.filteredPlaces.length === 0) {
      this.elements.placesList.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">🔍</div>
          <h4>Места не найдены</h4>
          <p>Попробуйте выбрать другую категорию</p>
        </div>
      `;
      return;
    }

    this.elements.placesList.innerHTML = this.filteredPlaces
      .map(place => this.createPlaceCard(place))
      .join('');
  },
  // Отрисовка карты
  renderMap() {
    if (!this.elements.mapContainer) return;

    // Очищаем контейнер карты
    this.elements.mapContainer.innerHTML = `
      <div id="leaflet-map" style="height: 100%; width: 100%;"></div>
    `;

    // Инициализируем карту Leaflet
    const mapElement = document.getElementById('leafletMap');
    
    // Координаты РГАУ-МСХА
    const universityCoords = [55.8198, 37.5355];
      // Создаем карту
    const map = L.map('leaflet-map', {
      attributionControl: false,
      zoomControl: true
    }).setView(universityCoords, 15);
      // Добавляем слой OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ''
    }).addTo(map);
    
    // Добавляем маркер университета
    const universityIcon = L.divIcon({
      className: 'university-marker',
      html: '<div style="background: #4a9058; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);">🏫</div>',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
    
    L.marker(universityCoords, { icon: universityIcon })
      .addTo(map)
      .bindPopup('<strong>РГАУ-МСХА им. К.А. Тимирязева</strong><br>Главный корпус университета');
    
    // Добавляем маркеры для отфильтрованных мест
    this.filteredPlaces.forEach(place => {
      const markerIcon = this.createMarkerIcon(place);
      const marker = L.marker([place.coordinates.lat, place.coordinates.lng], { icon: markerIcon })
        .addTo(map);
      
      // Создаем попап для маркера
      const popupContent = `
        <div class="map-popup">
          <h4>${place.name}</h4>
          <p class="popup-category">${place.category}</p>
          <div class="popup-info">
            <div class="popup-distance">� ${place.distance} км</div>
            <div class="popup-rating">⭐ ${place.rating}</div>
          </div>
          <p class="popup-address">${place.address}</p>
          <p class="popup-hours">🕒 ${place.hours}</p>
        </div>
      `;
      
      marker.bindPopup(popupContent);
    });
    
    // Если есть места для отображения, подгоняем карту под все маркеры
    if (this.filteredPlaces.length > 0) {
      const group = new L.featureGroup([
        L.marker(universityCoords),
        ...this.filteredPlaces.map(place => 
          L.marker([place.coordinates.lat, place.coordinates.lng])
        )
      ]);
      map.fitBounds(group.getBounds().pad(0.1));
    }
    
    // Сохраняем ссылку на карту
    this.mapInstance = map;
  },

  // Создание иконки маркера для места
  createMarkerIcon(place) {
    const typeIcons = {
      shop: '🛒',
      food: '🍽️',
      sport: '💪',
      medical: '🏥',
      service: '📦'
    };
    
    const typeColors = {
      shop: '#17a2b8',
      food: '#fd7e14',
      sport: '#6f42c1',
      medical: '#dc3545',
      service: '#20c997'
    };
    
    const icon = typeIcons[place.type] || '📍';
    const color = typeColors[place.type] || '#6c757d';
    
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background: ${color}; color: white; border-radius: 50%; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">${icon}</div>`,
      iconSize: [25, 25],
      iconAnchor: [12.5, 12.5]
    });
  },

  // Создание карточки места
  createPlaceCard(place) {
    const typeIcons = {
      shop: '🛒',
      food: '🍽️',
      sport: '💪',
      medical: '🏥',
      bank: '🏦',
      pharmacy: '💊',
      service: '✂️'
    };

    const priceLabels = {
      free: 'Бесплатно',
      low: '₽',
      medium: '₽₽',
      high: '₽₽₽'
    };

    return `
      <div class="place-card" data-id="${place.id}">
        <div class="place-header">
          <div class="place-icon">${typeIcons[place.type] || '📍'}</div>
          <div class="place-info">
            <h4 class="place-name">${place.name}</h4>
            <div class="place-category">${place.category}</div>
          </div>
          <div class="place-badges">
            <div class="distance-badge">${place.distance}км</div>
            <div class="price-badge price-${place.price}">${priceLabels[place.price]}</div>
          </div>
        </div>
        
        <div class="place-details">
          <div class="place-rating">
            <span class="rating-stars">${this.generateStars(place.rating)}</span>
            <span class="rating-value">${place.rating}</span>
          </div>
          
          <div class="place-address">
            <svg viewBox="0 0 24 24" fill="currentColor" class="icon">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            ${place.address}
          </div>
          
          <div class="place-hours">
            <svg viewBox="0 0 24 24" fill="currentColor" class="icon">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/>
            </svg>
            ${place.hours}
          </div>
          
          <div class="place-description">${place.description}</div>
        </div>
      </div>
    `;
  },

  // Генерация звезд рейтинга
  generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return '★'.repeat(fullStars) + 
           (hasHalfStar ? '☆' : '') + 
           '☆'.repeat(emptyStars);
  },
  // Обновление счетчика результатов
  updateResultsCount() {
    const countElement = document.querySelector('.places-count');
    if (countElement) {
      const count = this.filteredPlaces.length;
      const word = count === 1 ? 'объект' : count < 5 ? 'объекта' : 'объектов';
      countElement.textContent = `${count} ${word}`;
    }
  },

  // Получение места по ID
  getPlaceById(id) {
    return this.PLACES.find(place => place.id === id);
  },

  // Уничтожение виджета
  destroy() {
    console.log('🗺️ Интерактивная карта инфраструктуры уничтожена');
  }
};

// Экспорт для использования в других модулях
window.InfrastructureMap = InfrastructureMap;

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.infrastructure-map-container')) {
    InfrastructureMap.init();
  }
});
