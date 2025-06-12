// ===== АНИМАЦИИ И ЭФФЕКТЫ =====

const Animations = {
  // Конфигурация анимаций
  config: {
    observerOptions: {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    },
    animationDuration: 600,
    staggerDelay: 100
  },

  // Наблюдатель пересечений
  observer: null,

  // Инициализация
  init() {
    this.createObserver();
    this.initScrollAnimations();
    this.initHoverEffects();
    this.initLoadingAnimations();
    console.log('✨ Анимации инициализированы');
  },

  // Создание наблюдателя пересечений
  createObserver() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateElement(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      }, this.config.observerOptions);
    }
  },

  // Инициализация анимаций при прокрутке
  initScrollAnimations() {
    // Элементы для анимации появления
    const animatedElements = document.querySelectorAll(`
      .card,
      .timeline__item,
      .section__title,
      .hero__content,
      .feature-list__item
    `);

    animatedElements.forEach((element, index) => {
      // Добавляем начальные стили
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = `opacity ${this.config.animationDuration}ms ease, transform ${this.config.animationDuration}ms ease`;
      
      // Добавляем задержку для эффекта каскада
      element.style.transitionDelay = `${index * this.config.staggerDelay}ms`;

      // Наблюдаем за элементом
      if (this.observer) {
        this.observer.observe(element);
      }
    });

    // Fallback для браузеров без поддержки IntersectionObserver
    if (!this.observer) {
      this.fallbackScrollAnimation();
    }
  },

  // Анимация элемента
  animateElement(element) {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  },

  // Fallback анимация для старых браузеров
  fallbackScrollAnimation() {
    const handleScroll = App.utils.throttle(() => {
      const windowHeight = window.innerHeight;
      const scrollTop = window.pageYOffset;

      document.querySelectorAll('[style*="opacity: 0"]').forEach(element => {
        const elementTop = element.offsetTop;
        if (scrollTop + windowHeight > elementTop + 100) {
          this.animateElement(element);
        }
      });
    }, 100);

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Запускаем сразу для элементов в видимой области
  },

  // Инициализация эффектов при наведении
  initHoverEffects() {
    // Анимация карточек
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.addHoverEffect(card);
      });

      card.addEventListener('mouseleave', () => {
        this.removeHoverEffect(card);
      });
    });

    // Анимация кнопок
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        this.addButtonHover(button);
      });

      button.addEventListener('mouseleave', () => {
        this.removeButtonHover(button);
      });
    });

    // Анимация ссылок
    const links = document.querySelectorAll('.card__link, .nav__link');
    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        this.addLinkHover(link);
      });

      link.addEventListener('mouseleave', () => {
        this.removeLinkHover(link);
      });
    });
  },

  // Добавить эффект наведения на карточку
  addHoverEffect(card) {
    if (!card.style.transition.includes('transform')) {
      card.style.transition += ', transform 0.3s ease';
    }
    card.style.transform = 'translateY(-4px) scale(1.02)';
  },

  // Убрать эффект наведения с карточки
  removeHoverEffect(card) {
    card.style.transform = 'translateY(0) scale(1)';
  },

  // Добавить эффект наведения на кнопку
  addButtonHover(button) {
    if (!button.style.transition.includes('transform')) {
      button.style.transition += ', transform 0.2s ease';
    }
    button.style.transform = 'translateY(-2px)';
  },

  // Убрать эффект наведения с кнопки
  removeButtonHover(button) {
    button.style.transform = 'translateY(0)';
  },

  // Добавить эффект наведения на ссылку
  addLinkHover(link) {
    const arrow = link.querySelector('::after');
    // Анимация стрелки уже есть в CSS
  },

  // Убрать эффект наведения со ссылки
  removeLinkHover(link) {
    // CSS обрабатывает это автоматически
  },

  // Инициализация анимаций загрузки
  initLoadingAnimations() {
    // Анимация появления hero секции
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.style.opacity = '0';
      hero.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        hero.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
      }, 100);
    }

    // Анимация появления навигации
    const nav = document.querySelector('.nav');
    if (nav) {
      nav.style.opacity = '0';
      
      setTimeout(() => {
        nav.style.transition = 'opacity 0.6s ease';
        nav.style.opacity = '1';
      }, 300);
    }
  },

  // Анимация счетчика
  animateCounter(element, start = 0, end, duration = 2000) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      element.textContent = Math.floor(current);

      if (current >= end) {
        element.textContent = end;
        clearInterval(timer);
      }
    }, 16);
  },

  // Анимация прогресс-бара
  animateProgressBar(element, targetWidth, duration = 1000) {
    element.style.width = '0%';
    element.style.transition = `width ${duration}ms ease`;
    
    setTimeout(() => {
      element.style.width = targetWidth + '%';
    }, 100);
  },

  // Эффект печатающего текста
  typewriterEffect(element, text, speed = 50) {
    element.textContent = '';
    let i = 0;

    const type = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    };

    type();
  },

  // Анимация появления элементов по очереди
  staggerAnimation(elements, delay = 100) {
    elements.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, index * delay);
    });
  },

  // Плавное появление модального окна
  fadeInModal(modal) {
    modal.style.display = 'flex';
    modal.style.opacity = '0';
    modal.style.transition = 'opacity 0.3s ease';

    setTimeout(() => {
      modal.style.opacity = '1';
    }, 10);
  },

  // Плавное исчезновение модального окна
  fadeOutModal(modal) {
    modal.style.opacity = '0';
    
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
  },

  // Анимация загрузки (спиннер)
  showSpinner(container) {
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.innerHTML = `
      <div class="spinner"></div>
      <div class="loading-text">Загрузка...</div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      .loading-spinner {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
      }
      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid var(--primary-green);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      .loading-text {
        margin-top: 1rem;
        color: #666;
        font-size: 0.9rem;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;

    if (!document.querySelector('style[data-spinner]')) {
      style.setAttribute('data-spinner', 'true');
      document.head.appendChild(style);
    }

    container.appendChild(spinner);
    return spinner;
  },

  // Убрать анимацию загрузки
  hideSpinner(spinner) {
    if (spinner && spinner.parentNode) {
      spinner.style.opacity = '0';
      spinner.style.transition = 'opacity 0.3s ease';
      
      setTimeout(() => {
        if (spinner.parentNode) {
          spinner.parentNode.removeChild(spinner);
        }
      }, 300);
    }
  },

  // Анимация уведомлений
  showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
      <div class="notification__content">
        <div class="notification__message">${message}</div>
        <button class="notification__close">&times;</button>
      </div>
    `;

    // Добавляем стили если их еще нет
    if (!document.querySelector('style[data-notifications]')) {
      const style = document.createElement('style');
      style.setAttribute('data-notifications', 'true');
      style.textContent = `
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          max-width: 400px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transform: translateX(100%);
          transition: transform 0.3s ease;
          z-index: 2000;
          border-left: 4px solid;
        }
        .notification--info { border-left-color: var(--accent-blue); }
        .notification--success { border-left-color: #28a745; }
        .notification--warning { border-left-color: #ffc107; }
        .notification--error { border-left-color: #dc3545; }
        .notification.show { transform: translateX(0); }
        .notification__content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
        }
        .notification__close {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #999;
          cursor: pointer;
          margin-left: 1rem;
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Показываем уведомление
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    // Обработчик закрытия
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.addEventListener('click', () => {
      this.hideNotification(notification);
    });

    // Автоматическое скрытие
    setTimeout(() => {
      this.hideNotification(notification);
    }, duration);

    return notification;
  },

  // Скрыть уведомление
  hideNotification(notification) {
    notification.classList.remove('show');
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  },

  // Параллакс эффект
  initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (parallaxElements.length === 0) return;

    const handleScroll = App.utils.throttle(() => {
      const scrollTop = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrollTop * speed);
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
    }, 16);

    window.addEventListener('scroll', handleScroll);
  }
};

// Экспортируем для использования в других модулях
window.Animations = Animations;
