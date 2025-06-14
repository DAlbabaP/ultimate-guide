// ===== ИНТЕРАКТИВНЫЙ ГИД ПО ОБЩЕЖИТИЯМ =====

const DormitoryGuide = {
  // База данных общежитий РГАУ-МСХА
  DORMITORIES: [
    {
      id: 1,
      name: "Общежитие №1",
      address: "ул. Тимирязевская, 21",
      distance: "2 мин пешком",
      distanceToUniversity: 0.1,
      price: 1200,
      roomType: "блочный",
      peoplePerBlock: 5,
      hasRenovation: true,
      amenities: ["душ в блоке", "туалет в блоке", "общая кухня", "прачечная"],
      pros: ["Очень близко к корпусам", "После ремонта", "Хорошие условия"],
      cons: ["Может быть шумно из-за близости к дороге"],
      rating: 4.5,
      image: "dormitory-1.jpg",
      description: "Самое удобное общежитие для тех, кто ценит близость к учебным корпусам."
    },
    {
      id: 2,
      name: "Общежитие №2",
      address: "ул. Тимирязевская, 23",
      distance: "3 мин пешком",
      distanceToUniversity: 0.2,
      price: 1150,
      roomType: "блочный",
      peoplePerBlock: 5,
      hasRenovation: true,
      amenities: ["душ в блоке", "туалет в блоке", "общая кухня", "интернет"],
      pros: ["Близко к университету", "Недавний ремонт", "Тихое расположение"],
      cons: ["Меньше места для хранения"],
      rating: 4.3,
      image: "dormitory-2.jpg",
      description: "Отличный выбор для спокойного проживания и учебы."
    },
    {
      id: 3,
      name: "Общежитие №3",
      address: "ул. Прянишникова, 17",
      distance: "5 мин пешком",
      distanceToUniversity: 0.4,
      price: 1100,
      roomType: "блочный",
      peoplePerBlock: 4,
      hasRenovation: false,
      amenities: ["душ на этаже", "туалет на этаже", "общая кухня"],
      pros: ["Доступная цена", "Меньше людей в блоке"],
      cons: ["Требует ремонта", "Душ и туалет на этаже"],
      rating: 3.8,
      image: "dormitory-3.jpg",
      description: "Бюджетный вариант с приемлемыми условиями."
    },
    {
      id: 4,
      name: "Общежитие №4",
      address: "ул. Прянишникова, 19",
      distance: "6 мин пешком",
      distanceToUniversity: 0.5,
      price: 1050,
      roomType: "блочный",
      peoplePerBlock: 6,
      hasRenovation: false,
      amenities: ["душ на этаже", "туалет на этаже", "общая кухня", "спортзал"],
      pros: ["Самая низкая цена", "Есть спортзал", "Большие комнаты"],
      cons: ["Старые условия", "Много людей в блоке", "Дальше от корпусов"],
      rating: 3.5,
      image: "dormitory-4.jpg",
      description: "Экономичный вариант для непритязательных студентов."
    },
    {
      id: 5,
      name: "Общежитие №5",
      address: "3-й Новомихалковский пр., 5",
      distance: "10 мин пешком",
      distanceToUniversity: 0.8,
      price: 1300,
      roomType: "блочный",
      peoplePerBlock: 4,
      hasRenovation: true,
      amenities: ["душ в блоке", "туалет в блоке", "общая кухня", "охрана 24/7", "парковка"],
      pros: ["Отличные условия", "Современный ремонт", "Хорошая безопасность", "Тихий район"],
      cons: ["Дороже", "Дальше от университета"],
      rating: 4.7,
      image: "dormitory-5.jpg",
      description: "Премиальное общежитие с лучшими условиями проживания."
    },
    {
      id: 6,
      name: "Общежитие №6",
      address: "3-й Новомихалковский пр., 7",
      distance: "12 мин пешком",
      distanceToUniversity: 1.0,
      price: 1250,
      roomType: "блочный",
      peoplePerBlock: 5,
      hasRenovation: true,
      amenities: ["душ в блоке", "туалет в блоке", "общая кухня", "прачечная", "магазин"],
      pros: ["Хорошие условия", "Есть магазин рядом", "Просторные комнаты"],
      cons: ["Дальше от университета", "Цена выше средней"],
      rating: 4.2,
      image: "dormitory-6.jpg",
      description: "Комфортное проживание в спокойном районе."
    },
    {
      id: 7,
      name: "Общежитие №7",
      address: "ул. Костякова, 15",
      distance: "8 мин пешком",
      distanceToUniversity: 0.6,
      price: 1180,
      roomType: "блочный",
      peoplePerBlock: 5,
      hasRenovation: false,
      amenities: ["душ на этаже", "туалет в блоке", "общая кухня", "библиотека"],
      pros: ["Умеренная цена", "Есть библиотека", "Близко к метро"],
      cons: ["Частичный ремонт", "Душ на этаже"],
      rating: 3.9,
      image: "dormitory-7.jpg",
      description: "Неплохой вариант для студентов с ограниченным бюджетом."
    },
    {
      id: 8,
      name: "Общежитие №8",
      address: "ул. Костякова, 17",
      distance: "7 мин пешком",
      distanceToUniversity: 0.5,
      price: 1220,
      roomType: "блочный",
      peoplePerBlock: 4,
      hasRenovation: true,
      amenities: ["душ в блоке", "туалет в блоке", "общая кухня", "интернет", "камеры хранения"],
      pros: ["Свежий ремонт", "Меньше людей в блоке", "Хорошее расположение"],
      cons: ["Средняя цена"],
      rating: 4.4,
      image: "dormitory-8.jpg",
      description: "Оптимальное соотношение цены и качества."
    }
  ],

  // Элементы DOM
  elements: {
    filtersForm: null,
    resultsContainer: null,
    noResults: null,
    resultsCount: null
  },

  // Текущие фильтры
  currentFilters: {
    maxPrice: 1500,
    maxDistance: 15,
    peoplePerBlock: 'any',
    hasRenovation: 'any',
    amenities: []
  },

  // Инициализация
  init() {
    this.findElements();
    this.bindEvents();
    this.displayDormitories(this.DORMITORIES);
    console.log('🏠 Интерактивный гид по общежитиям инициализирован');
  },

  // Поиск элементов в DOM
  findElements() {
    this.elements.filtersForm = document.getElementById('dormitory-filters');
    this.elements.resultsContainer = document.getElementById('dormitory-results');
    this.elements.noResults = document.getElementById('no-results');
    this.elements.resultsCount = document.getElementById('results-count');
  },

  // Привязка событий
  bindEvents() {
    if (this.elements.filtersForm) {
      // Обновление при изменении фильтров
      const inputs = this.elements.filtersForm.querySelectorAll('input, select');
      inputs.forEach(input => {
        input.addEventListener('change', () => this.applyFilters());
        if (input.type === 'range') {
          input.addEventListener('input', () => this.updateRangeDisplay(input));
        }
      });

      // Сброс фильтров
      const resetBtn = document.getElementById('reset-filters');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => this.resetFilters());
      }
    }

    // Сортировка
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
      sortSelect.addEventListener('change', () => this.applyFilters());
    }
  },

  // Применение фильтров
  applyFilters() {
    this.updateCurrentFilters();
    const filteredDormitories = this.filterDormitories();
    const sortedDormitories = this.sortDormitories(filteredDormitories);
    this.displayDormitories(sortedDormitories);
  },

  // Обновление текущих фильтров
  updateCurrentFilters() {
    const form = this.elements.filtersForm;
    
    this.currentFilters = {
      maxPrice: parseInt(form.querySelector('[name="max-price"]')?.value) || 1500,
      maxDistance: parseInt(form.querySelector('[name="max-distance"]')?.value) || 15,
      peoplePerBlock: form.querySelector('[name="people-per-block"]')?.value || 'any',
      hasRenovation: form.querySelector('[name="has-renovation"]')?.value || 'any',
      amenities: Array.from(form.querySelectorAll('[name="amenities"]:checked')).map(cb => cb.value)
    };
  },

  // Фильтрация общежитий
  filterDormitories() {
    return this.DORMITORIES.filter(dormitory => {
      // Фильтр по цене
      if (dormitory.price > this.currentFilters.maxPrice) return false;

      // Фильтр по расстоянию
      if (dormitory.distanceToUniversity > this.currentFilters.maxDistance / 10) return false;

      // Фильтр по количеству людей в блоке
      if (this.currentFilters.peoplePerBlock !== 'any') {
        const maxPeople = parseInt(this.currentFilters.peoplePerBlock);
        if (dormitory.peoplePerBlock > maxPeople) return false;
      }

      // Фильтр по ремонту
      if (this.currentFilters.hasRenovation !== 'any') {
        const needsRenovation = this.currentFilters.hasRenovation === 'true';
        if (dormitory.hasRenovation !== needsRenovation) return false;
      }

      // Фильтр по удобствам
      if (this.currentFilters.amenities.length > 0) {
        const hasAllAmenities = this.currentFilters.amenities.every(amenity => 
          dormitory.amenities.some(dormAmenity => 
            dormAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        );
        if (!hasAllAmenities) return false;
      }

      return true;
    });
  },

  // Сортировка общежитий
  sortDormitories(dormitories) {
    const sortBy = document.getElementById('sort-by')?.value || 'rating';
    
    return [...dormitories].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'distance':
          return a.distanceToUniversity - b.distanceToUniversity;
        case 'rating':
        default:
          return b.rating - a.rating;
      }
    });
  },

  // Отображение общежитий
  displayDormitories(dormitories) {
    if (!this.elements.resultsContainer) return;

    // Обновляем счетчик результатов
    if (this.elements.resultsCount) {
      this.elements.resultsCount.textContent = dormitories.length;
    }

    // Показываем/скрываем блок "нет результатов"
    if (this.elements.noResults) {
      this.elements.noResults.style.display = dormitories.length === 0 ? 'block' : 'none';
    }

    // Генерируем HTML для общежитий
    this.elements.resultsContainer.innerHTML = dormitories.map(dormitory => 
      this.createDormitoryCard(dormitory)
    ).join('');

    // Добавляем анимацию появления
    this.animateCards();
  },

  // Создание карточки общежития
  createDormitoryCard(dormitory) {
    return `
      <div class="dormitory-card" data-id="${dormitory.id}">
        <div class="card-header">
          <div class="card-image">
            <div class="image-placeholder">🏠</div>
            <div class="rating-badge">
              <span class="rating-stars">${this.generateStars(dormitory.rating)}</span>
              <span class="rating-number">${dormitory.rating}</span>
            </div>
          </div>
          <div class="card-info">
            <h3 class="dormitory-name">${dormitory.name}</h3>
            <p class="dormitory-address">${dormitory.address}</p>
            <div class="dormitory-distance">📍 ${dormitory.distance} до университета</div>
          </div>
          <div class="card-price">
            <div class="price-amount">${dormitory.price.toLocaleString()} ₽</div>
            <div class="price-period">в месяц</div>
          </div>
        </div>

        <div class="card-body">
          <p class="dormitory-description">${dormitory.description}</p>
          
          <div class="dormitory-details">
            <div class="detail-item">
              <span class="detail-icon">👥</span>
              <span class="detail-text">${dormitory.peoplePerBlock} человек в блоке</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">🏗️</span>
              <span class="detail-text">${dormitory.hasRenovation ? 'После ремонта' : 'Требует ремонта'}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">🏢</span>
              <span class="detail-text">${dormitory.roomType} тип</span>
            </div>
          </div>

          <div class="amenities-list">
            <h4 class="amenities-title">Удобства:</h4>
            <div class="amenities-tags">
              ${dormitory.amenities.map(amenity => 
                `<span class="amenity-tag">${amenity}</span>`
              ).join('')}
            </div>
          </div>

          <div class="pros-cons">
            <div class="pros">
              <h4 class="pros-title">✅ Плюсы:</h4>
              <ul class="pros-list">
                ${dormitory.pros.map(pro => `<li>${pro}</li>`).join('')}
              </ul>
            </div>
            <div class="cons">
              <h4 class="cons-title">❌ Минусы:</h4>
              <ul class="cons-list">
                ${dormitory.cons.map(con => `<li>${con}</li>`).join('')}
              </ul>
            </div>
          </div>        </div>
      </div>
    `;
  },

  // Генерация звездочек рейтинга
  generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
      stars += '⭐';
    }
    if (hasHalfStar) {
      stars += '⭐';
    }

    return stars;
  },

  // Обновление отображения значения range input
  updateRangeDisplay(input) {
    const outputId = input.getAttribute('data-output');
    const output = document.getElementById(outputId);
    if (output) {
      let value = input.value;
      if (input.name === 'max-price') {
        value = value + ' ₽';
      } else if (input.name === 'max-distance') {
        value = value + ' мин';
      }
      output.textContent = value;
    }
  },

  // Анимация появления карточек
  animateCards() {
    const cards = this.elements.resultsContainer.querySelectorAll('.dormitory-card');
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });
  },

  // Сброс фильтров
  resetFilters() {
    if (this.elements.filtersForm) {
      this.elements.filtersForm.reset();
      
      // Сброс range inputs
      const rangeInputs = this.elements.filtersForm.querySelectorAll('input[type="range"]');
      rangeInputs.forEach(input => {
        this.updateRangeDisplay(input);
      });
    }

    this.currentFilters = {
      maxPrice: 1500,
      maxDistance: 15,
      peoplePerBlock: 'any',
      hasRenovation: 'any',
      amenities: []
    };

    this.displayDormitories(this.DORMITORIES);
  },

  // Рекомендация общежития
  getRecommendations(preferences = {}) {
    const {
      budget = 'medium',
      priorityDistance = true,
      needsQuiet = false,
      wantsLuxury = false
    } = preferences;

    let recommendations = [...this.DORMITORIES];

    if (budget === 'low') {
      recommendations = recommendations.filter(d => d.price <= 1150);
    } else if (budget === 'high') {
      recommendations = recommendations.filter(d => d.price >= 1200);
    }

    if (priorityDistance) {
      recommendations.sort((a, b) => a.distanceToUniversity - b.distanceToUniversity);
    }

    if (needsQuiet) {
      recommendations = recommendations.filter(d => !d.address.includes('Тимирязевская'));
    }

    if (wantsLuxury) {
      recommendations = recommendations.filter(d => d.hasRenovation && d.rating >= 4.0);
    }

    return recommendations.slice(0, 3);
  }
};

// Экспорт для использования в других модулях
window.DormitoryGuide = DormitoryGuide;

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('dormitory-filters')) {
    DormitoryGuide.init();
  }
});
