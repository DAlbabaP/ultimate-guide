// ===== ИНТЕРАКТИВНАЯ ВРЕМЕННАЯ ШКАЛА =====

const Timeline = {
  // Элементы DOM
  elements: {
    timeline: null,
    items: null,
    progressLine: null,
    points: null
  },

  // Состояние
  currentStep: 0,
  totalSteps: 0,
  isInteractive: false,

  // Инициализация
  init() {
    this.findElements();
    if (this.elements.timeline) {
      this.setupTimeline();
      this.bindEvents();
      this.updateProgress();
      console.log('⏱️ Временная шкала инициализирована');
    }
  },

  // Поиск элементов в DOM
  findElements() {
    this.elements.timeline = document.querySelector('.timeline');
    this.elements.items = document.querySelectorAll('.timeline__item');
    this.elements.progressLine = document.querySelector('.timeline__progress');
    this.elements.points = document.querySelectorAll('.timeline__point');
  },

  // Настройка временной шкалы
  setupTimeline() {
    if (!this.elements.timeline) return;

    this.totalSteps = this.elements.items.length;
    this.isInteractive = this.elements.timeline.classList.contains('timeline--interactive');

    // Создаем прогресс-линию если её нет
    if (!this.elements.progressLine && this.elements.timeline) {
      this.createProgressLine();
    }

    // Определяем текущий шаг на основе даты или статуса
    this.determineCurrentStep();

    // Обновляем статусы точек
    this.updatePointStatuses();
  },

  // Создание прогресс-линии
  createProgressLine() {
    const line = document.createElement('div');
    line.className = 'timeline__progress';
    
    const timelineContainer = this.elements.timeline.querySelector('.timeline__container');
    if (timelineContainer) {
      timelineContainer.appendChild(line);
      this.elements.progressLine = line;
    }
  },

  // Определение текущего шага
  determineCurrentStep() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // 1-12
    
    // Логика определения текущего этапа на основе месяца
    if (currentMonth >= 6 && currentMonth <= 7) {
      this.currentStep = 1; // Подача документов
    } else if (currentMonth === 7) {
      this.currentStep = 2; // Конкурсный отбор
    } else if (currentMonth === 8) {
      this.currentStep = 3; // Зачисление/Заселение
    } else if (currentMonth === 9) {
      this.currentStep = 4; // Адаптация
    } else {
      this.currentStep = 0; // Подготовка
    }

    // Можно также проверить localStorage для персонализации
    const savedStep = localStorage.getItem('applicant-current-step');
    if (savedStep) {
      this.currentStep = parseInt(savedStep);
    }
  },

  // Обновление статусов точек
  updatePointStatuses() {
    this.elements.points.forEach((point, index) => {
      point.classList.remove('timeline__point--completed', 'timeline__point--current');
      
      if (index < this.currentStep) {
        point.classList.add('timeline__point--completed');
      } else if (index === this.currentStep) {
        point.classList.add('timeline__point--current');
      }
    });
  },

  // Привязка событий
  bindEvents() {
    if (!this.isInteractive) return;

    // Клики по элементам временной шкалы
    this.elements.items.forEach((item, index) => {
      item.addEventListener('click', () => {
        this.selectStep(index);
      });

      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectStep(index);
        }
      });

      // Делаем элементы фокусируемыми
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
    });

    // Навигация с клавиатуры
    document.addEventListener('keydown', (e) => {
      if (!this.elements.timeline.matches(':focus-within')) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          this.navigateStep(-1);
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          this.navigateStep(1);
          break;
      }
    });
  },

  // Выбор шага
  selectStep(stepIndex) {
    if (stepIndex < 0 || stepIndex >= this.totalSteps) return;

    this.currentStep = stepIndex;
    this.updatePointStatuses();
    this.updateProgress();
    this.animateToStep(stepIndex);

    // Сохраняем выбор пользователя
    localStorage.setItem('applicant-current-step', stepIndex.toString());

    // Отправляем кастомное событие
    const event = new CustomEvent('timeline:stepChanged', {
      detail: { step: stepIndex }
    });
    this.elements.timeline.dispatchEvent(event);
  },

  // Навигация по шагам
  navigateStep(direction) {
    const newStep = this.currentStep + direction;
    if (newStep >= 0 && newStep < this.totalSteps) {
      this.selectStep(newStep);
    }
  },

  // Анимация к выбранному шагу
  animateToStep(stepIndex) {
    const targetItem = this.elements.items[stepIndex];
    if (!targetItem) return;

    // Плавно прокручиваем к элементу
    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
    const offset = headerHeight + 50;

    App.utils.scrollToElement(targetItem, offset);

    // Добавляем визуальный эффект
    targetItem.style.transform = 'scale(1.05)';
    setTimeout(() => {
      targetItem.style.transform = 'scale(1)';
    }, 300);
  },

  // Обновление прогресса
  updateProgress(scrollTop = null) {
    if (!this.elements.progressLine) return;

    let progress = 0;

    if (scrollTop !== null) {
      // Обновляем прогресс на основе прокрутки
      progress = this.calculateScrollProgress(scrollTop);
    } else {
      // Обновляем прогресс на основе текущего шага
      progress = (this.currentStep / Math.max(this.totalSteps - 1, 1)) * 100;
    }

    // Анимируем изменение прогресса
    this.elements.progressLine.style.height = `${Math.min(progress, 100)}%`;
  },

  // Расчет прогресса на основе прокрутки
  calculateScrollProgress(scrollTop) {
    if (!this.elements.timeline) return 0;

    const timelineTop = this.elements.timeline.offsetTop;
    const timelineHeight = this.elements.timeline.offsetHeight;
    const windowHeight = window.innerHeight;

    const scrollProgress = (scrollTop - timelineTop + windowHeight) / timelineHeight;
    return Math.max(0, Math.min(scrollProgress * 100, 100));
  },

  // Обновление макета (для адаптивности)
  updateLayout() {
    // Пересчитываем позиции элементов после изменения размера окна
    if (this.elements.progressLine) {
      this.updateProgress();
    }
  },

  // Добавление нового шага в временную шкалу
  addStep(stepData) {
    if (!this.elements.timeline) return;

    const container = this.elements.timeline.querySelector('.timeline__container');
    if (!container) return;

    const stepElement = this.createStepElement(stepData);
    container.appendChild(stepElement);

    this.totalSteps++;
    this.elements.items = document.querySelectorAll('.timeline__item');
    this.elements.points = document.querySelectorAll('.timeline__point');

    // Перепривязываем события
    this.bindEvents();
  },

  // Создание элемента шага
  createStepElement(stepData) {
    const item = document.createElement('div');
    item.className = 'timeline__item';
    
    item.innerHTML = `
      <div class="timeline__point"></div>
      <div class="timeline__content">
        <div class="timeline__date">${stepData.date}</div>
        <h3 class="timeline__title">${stepData.title}</h3>
        <p class="timeline__description">${stepData.description}</p>
        ${stepData.link ? `<a href="${stepData.link.url}" class="timeline__link">${stepData.link.text}</a>` : ''}
      </div>
    `;

    return item;
  },

  // Отметить шаг как выполненный
  markStepCompleted(stepIndex) {
    if (stepIndex < 0 || stepIndex >= this.totalSteps) return;

    const point = this.elements.points[stepIndex];
    if (point) {
      point.classList.add('timeline__point--completed');
      point.classList.remove('timeline__point--current');
    }

    // Обновляем текущий шаг если необходимо
    if (stepIndex >= this.currentStep) {
      this.currentStep = stepIndex + 1;
      this.updatePointStatuses();
      this.updateProgress();
    }

    // Сохраняем состояние
    const completedSteps = this.getCompletedSteps();
    completedSteps.push(stepIndex);
    localStorage.setItem('applicant-completed-steps', JSON.stringify(completedSteps));
  },

  // Получить завершенные шаги
  getCompletedSteps() {
    const saved = localStorage.getItem('applicant-completed-steps');
    return saved ? JSON.parse(saved) : [];
  },

  // Сбросить прогресс
  resetProgress() {
    this.currentStep = 0;
    this.updatePointStatuses();
    this.updateProgress();
    
    localStorage.removeItem('applicant-current-step');
    localStorage.removeItem('applicant-completed-steps');
  },

  // Экспорт прогресса
  exportProgress() {
    return {
      currentStep: this.currentStep,
      totalSteps: this.totalSteps,
      completedSteps: this.getCompletedSteps(),
      timestamp: Date.now()
    };
  },

  // Импорт прогресса
  importProgress(progressData) {
    if (!progressData || typeof progressData !== 'object') return;

    this.currentStep = progressData.currentStep || 0;
    
    if (progressData.completedSteps) {
      localStorage.setItem('applicant-completed-steps', JSON.stringify(progressData.completedSteps));
      
      // Отмечаем завершенные шаги
      progressData.completedSteps.forEach(stepIndex => {
        const point = this.elements.points[stepIndex];
        if (point) {
          point.classList.add('timeline__point--completed');
        }
      });
    }

    this.updatePointStatuses();
    this.updateProgress();
  }
};

// Экспортируем для использования в других модулях
window.Timeline = Timeline;
