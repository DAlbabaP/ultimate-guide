// ===== ВИДЖЕТ ВАЖНЫХ ДАТ =====

const ImportantDates = {
  // База важных дат для абитуриентов (обновляется каждый год)
  DATES: [
    {
      id: 'application-start',
      title: 'Начало приема документов',
      period: '20 июня - 25 июля 2025',
      date: '2025-06-20',
      description: 'Открывается подача документов в приемную комиссию',
      icon: '📝',
      type: 'start',
      priority: 'high'
    },
    {
      id: 'application-end',
      title: 'Окончание приема документов',
      period: 'до 25 июля 2025, 18:00',
      date: '2025-07-25',
      time: '18:00',
      description: 'Последний день подачи документов онлайн и очно',
      icon: '⏰',
      type: 'deadline',
      priority: 'critical'
    },
    {
      id: 'consent-deadline',
      title: 'Подача согласия на зачисление',
      period: 'до 26 июля 2025, 18:00',
      date: '2025-07-26',
      time: '18:00',
      description: 'Крайний срок подачи согласия на зачисление',
      icon: '✅',
      type: 'deadline',
      priority: 'critical'
    },
    {
      id: 'enrollment-start',
      title: 'Начало зачисления',
      period: '1-20 августа 2025',
      date: '2025-08-01',
      description: 'Подача оригиналов документов и заключение договоров',
      icon: '🎓',
      type: 'start',
      priority: 'high'
    },
    {
      id: 'dormitory-settlement',
      title: 'Заселение в общежития',
      period: '25 августа - 5 сентября 2025',
      date: '2025-08-25',
      description: 'Начало заселения студентов в общежития',
      icon: '🏠',
      type: 'start',
      priority: 'medium'
    },
    {
      id: 'academic-year-start',
      title: 'День знаний',
      date: '2025-09-01',
      description: 'Торжественная линейка и начало учебного года',
      icon: '🎊',
      type: 'celebration',
      priority: 'medium'
    }
  ],
  // Элементы DOM
  elements: {
    container: null,
    button: null
  },

  // Состояние
  currentDate: new Date(),
  updateInterval: null,
  isExpanded: false,

  // Инициализация
  init() {
    this.findElements();
    this.bindEvents();
    this.render();
    this.startUpdateTimer();
    console.log('📅 Виджет важных дат инициализирован');
  },

  // Поиск элементов в DOM
  findElements() {
    this.elements.container = document.getElementById('importantDatesContainer');
    this.elements.button = document.getElementById('showAllDatesBtn');
  },

  // Привязка событий
  bindEvents() {
    if (this.elements.button) {
      this.elements.button.addEventListener('click', () => {
        this.toggleExpanded();
      });
    }
  },

  // Переключение развернутого состояния
  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
    this.render();
    
    if (this.elements.button) {
      this.elements.button.classList.toggle('expanded', this.isExpanded);
      this.elements.button.innerHTML = `
        ${this.isExpanded ? 'Скрыть' : 'Показать все даты'}
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
        </svg>
      `;
    }
  },

  // Основная функция отрисовки
  render() {
    if (!this.elements.container) return;

    const sortedDates = this.getSortedUpcomingDates();
    const displayCount = this.isExpanded ? sortedDates.length : 3;
    const datesToShow = sortedDates.slice(0, displayCount);
    
    this.elements.container.innerHTML = datesToShow.map(dateItem => 
      this.createDateItemHTML(dateItem)
    ).join('');
    
    if (this.elements.container.parentElement) {
      this.elements.container.parentElement.classList.toggle('dates-expanded', this.isExpanded);
    }
    
    this.updateCountdowns();
  },

  // Получение отсортированных предстоящих дат
  getSortedUpcomingDates() {
    const now = new Date();
    
    return this.DATES
      .map(dateItem => ({
        ...dateItem,
        daysDiff: this.getDaysDifference(dateItem.date),
        status: this.getDateStatus(dateItem.date)
      }))
      .filter(dateItem => dateItem.daysDiff >= -1) // Показываем даты за день до и все будущие
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  },

  // Создание HTML для элемента даты
  createDateItemHTML(dateItem) {
    const { daysDiff, status } = dateItem;
    const countdownText = this.getCountdownText(daysDiff);
    
    return `
      <div class="date-item ${status}" data-id="${dateItem.id}">
        <div class="date-content">
          <h4 class="date-title">${dateItem.title}</h4>
          <p class="date-period">${dateItem.period}</p>
        </div>
        <div class="date-countdown">
          <div class="countdown-value">${countdownText.value}</div>
          <div class="countdown-label">${countdownText.label}</div>
        </div>
        ${dateItem.priority === 'critical' && daysDiff <= 7 && daysDiff >= 0 ? 
          '<div class="notification-badge">!</div>' : ''}
      </div>
    `;
  },  // Получение статуса даты
  getDateStatus(dateString) {
    const daysDiff = this.getDaysDifference(dateString);
    
    if (daysDiff < 0) return 'completed';
    if (daysDiff <= 3) return 'urgent';
    if (daysDiff <= 14) return 'soon';
    return '';
  },

  // Получение разности в днях
  getDaysDifference(dateString) {
    const eventDate = new Date(dateString);
    const now = new Date();
    const diffTime = eventDate.setHours(0,0,0,0) - now.setHours(0,0,0,0);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  // Получение текста обратного отсчета
  getCountdownText(daysDiff) {
    if (daysDiff < 0) {
      return { value: 'Завершено', label: '' };
    }
    
    if (daysDiff === 0) {
      return { value: 'Сегодня', label: '!' };
    }
    
    if (daysDiff === 1) {      return { value: 'Завтра', label: '!' };
    }
    
    if (daysDiff <= 7) {
      return { value: `${daysDiff} дн.`, label: 'осталось' };
    }
    
    if (daysDiff <= 30) {
      return { value: `${daysDiff} дн.`, label: 'до события' };
    }
    
    const weeks = Math.floor(daysDiff / 7);
    return { value: `${weeks} нед.`, label: 'до события' };
  },

  // Обновление обратного отсчета
  updateCountdowns() {
    const dateItems = document.querySelectorAll('.date-item');
    
    dateItems.forEach(item => {
      const dateId = item.dataset.id;
      const dateItem = this.DATES.find(d => d.id === dateId);
      
      if (dateItem) {
        const daysDiff = this.getDaysDifference(dateItem.date);
        const status = this.getDateStatus(dateItem.date);
        const countdownText = this.getCountdownText(daysDiff);
        
        // Обновляем статус элемента
        item.className = `date-item ${status}`;
        
        // Обновляем текст обратного отсчета
        const countdownValue = item.querySelector('.countdown-value');
        const countdownLabel = item.querySelector('.countdown-label');
        
        if (countdownValue) countdownValue.textContent = countdownText.value;
        if (countdownLabel) countdownLabel.textContent = countdownText.label;
      }
    });
  },

  // Запуск таймера обновления
  startUpdateTimer() {
    // Обновляем каждые 10 минут
    this.updateInterval = setInterval(() => {
      this.updateCountdowns();
      
      // Полная перерисовка каждый час
      const now = new Date();
      if (now.getMinutes() === 0) {
        this.render();
      }
    }, 600000); // 10 минут
  },

  // Остановка таймера
  stopUpdateTimer() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  },

  // Получение следующего важного события
  getNextImportantEvent() {
    const upcoming = this.getSortedUpcomingDates();
    return upcoming.find(event => event.priority === 'critical') || upcoming[0];
  },

  // Проверка наличия критических событий сегодня
  hasCriticalEventsToday() {
    const today = new Date().toISOString().split('T')[0];
    return this.DATES.some(event => 
      event.date === today && event.priority === 'critical'
    );
  },

  // Получение уведомлений для пользователя
  getNotifications() {
    const notifications = [];

    this.DATES.forEach(event => {
      const daysDiff = this.getDaysDifference(event.date);

      if (daysDiff === 0 && event.priority === 'critical') {
        notifications.push({
          type: 'critical',
          message: `Сегодня: ${event.title}`,
          event: event
        });
      } else if (daysDiff === 1 && event.priority === 'critical') {
        notifications.push({
          type: 'warning',
          message: `Завтра: ${event.title}`,
          event: event
        });
      } else if (daysDiff <= 3 && event.priority === 'high') {
        notifications.push({
          type: 'info',
          message: `Через ${daysDiff} дн.: ${event.title}`,
          event: event
        });
      }
    });

    return notifications;
  },

  // Уничтожение виджета
  destroy() {
    this.stopUpdateTimer();
    if (this.elements.container) {
      this.elements.container.innerHTML = '';
    }
    console.log('📅 Виджет важных дат уничтожен');
  }
};

// Экспорт для использования в других модулях
window.ImportantDates = ImportantDates;

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('importantDatesContainer')) {
    ImportantDates.init();
  }
});
