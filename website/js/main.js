// ===== ОСНОВНОЙ JAVASCRIPT =====

class UniGuideApp {
    constructor() {
        this.enhancedSearchEngine = null;
        this.widgetManager = null;
        this.initializeApp();
    }

    initializeApp() {
        // Ждем загрузки DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        try {
            // Инициализируем компоненты
            this.initializeHeader();
            this.initializeNavigation();
            this.initializeScrollEffects();
            this.initializeAnimations();
            this.initializeLazyLoading();
              // Инициализируем виджеты и enhanced search
            if (typeof WidgetManager !== 'undefined') {
                this.widgetManager = new WidgetManager();
            }
            
            // Enhanced Search будет инициализирован автоматически через enhanced-search.js
            if (typeof EnhancedSearchEngine !== 'undefined') {
                console.log('Enhanced Search готов к использованию');
            }

            // Показываем уведомления о важных датах
            this.checkImportantNotifications();
            
            // Инициализация переключателя темы
            this.initializeThemeToggle();
            
            console.log('UniGuide App инициализирован успешно');
        } catch (error) {
            console.error('Ошибка инициализации приложения:', error);
        }
    }

    // Инициализация хедера
    initializeHeader() {
        const header = document.getElementById('header');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const nav = document.getElementById('nav');

        if (!header) return;

        // Скрытие/показ хедера при скролле
        let lastScrollTop = 0;
        let isScrolling = false;

        const handleScroll = () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    
                    // Добавляем/убираем класс scrolled
                    if (scrollTop > 100) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }

                    // Скрываем/показываем хедер при быстром скролле
                    if (scrollTop > lastScrollTop && scrollTop > 200) {
                        header.style.transform = 'translateY(-100%)';
                    } else {
                        header.style.transform = 'translateY(0)';
                    }

                    lastScrollTop = scrollTop;
                    isScrolling = false;
                });
                isScrolling = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Мобильное меню
        if (mobileMenuBtn && nav) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenuBtn.classList.toggle('active');
                nav.classList.toggle('active');
                
                // Блокируем скролл при открытом меню
                if (nav.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });

            // Закрытие меню при клике на ссылку
            const navLinks = nav.querySelectorAll('.nav__link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenuBtn.classList.remove('active');
                    nav.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });

            // Закрытие меню при изменении размера экрана
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    mobileMenuBtn.classList.remove('active');
                    nav.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    }

    // Инициализация навигации
    initializeNavigation() {
        // Плавная прокрутка к якорям
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerHeight = document.getElementById('header')?.offsetHeight || 80;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Активная ссылка в навигации
        const navLinks = document.querySelectorAll('.nav__link');
        const sections = document.querySelectorAll('section[id]');

        const updateActiveLink = () => {
            const scrollPosition = window.scrollY + 150;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        };

        window.addEventListener('scroll', updateActiveLink, { passive: true });
    }

    // Эффекты при скролле
    initializeScrollEffects() {
        // Кнопка "Наверх"
        const scrollToTopBtn = document.getElementById('scrollToTop');
        
        if (scrollToTopBtn) {
            const toggleScrollButton = () => {
                if (window.scrollY > 300) {
                    scrollToTopBtn.classList.add('visible');
                } else {
                    scrollToTopBtn.classList.remove('visible');
                }
            };

            window.addEventListener('scroll', toggleScrollButton, { passive: true });

            scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // Параллакс эффект для hero секции
        const hero = document.querySelector('.hero');
        const progressCircle = document.querySelector('.progress-circle');

        if (hero && progressCircle) {
            const heroParallax = () => {
                const scrolled = window.pageYOffset;
                const parallaxSpeed = 0.5;
                
                if (scrolled < hero.offsetHeight) {
                    progressCircle.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
                }
            };

            window.addEventListener('scroll', heroParallax, { passive: true });
        }
    }

    // Анимации появления элементов
    initializeAnimations() {
        // Intersection Observer для анимаций
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const animateOnScroll = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    animateOnScroll.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Элементы для анимации
        const animatedElements = document.querySelectorAll(`
            .timeline__item,
            .quick-link__card,
            .widget,
            .update__item,
            .section__title
        `);

        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            animateOnScroll.observe(el);
        });

        // Добавляем CSS для анимации
        const animationStyles = `
            .fade-in-up {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = animationStyles;
        document.head.appendChild(styleSheet);
    }

    // Ленивая загрузка изображений
    initializeLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if (lazyImages.length === 0) return;

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

        lazyImages.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });

        // CSS для ленивых изображений
        const lazyStyles = `
            .lazy {
                filter: blur(5px);
                transition: filter 0.3s;
            }
            
            .lazy:not([src]) {
                background: var(--light-gray);
                min-height: 100px;
            }
        `;

        const lazyStyleSheet = document.createElement('style');
        lazyStyleSheet.textContent = lazyStyles;
        document.head.appendChild(lazyStyleSheet);
    }

    // Проверка важных уведомлений
    checkImportantNotifications() {
        // Проверяем, показывалось ли уведомление сегодня
        const today = new Date().toDateString();
        const lastNotification = localStorage.getItem('lastNotificationDate');

        if (lastNotification === today) return;

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentDate = now.getDate();

        // Уведомления в зависимости от даты
        let message = null;
        let type = 'info';

        // Июнь - напоминание о подаче документов
        if (currentMonth === 5 && currentDate >= 15) {
            message = 'Не забудьте подать документы до 20 июля!';
            type = 'warning';
        }
        // Июль - конкурсные списки
        else if (currentMonth === 6 && currentDate >= 25) {
            message = 'Скоро будут опубликованы конкурсные списки. Подготовьте оригинал аттестата!';
            type = 'warning';
        }
        // Август - заселение
        else if (currentMonth === 7 && currentDate >= 20) {
            message = 'Подготовьтесь к заселению в общежитие. Проверьте список необходимых документов!';
            type = 'info';
        }

        if (message && this.widgetManager) {
            setTimeout(() => {
                this.widgetManager.showNotification(message, type);
                localStorage.setItem('lastNotificationDate', today);
            }, 2000);
        }
    }

    // Инициализация переключателя темы
    initializeThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = document.getElementById('themeIcon');
        
        if (!themeToggle || !themeIcon) return;

        // Загружаем сохраненную тему
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);

        // Обработчик клика
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Установка темы
    setTheme(theme) {
        const themeIcon = document.getElementById('themeIcon');
        
        document.documentElement.setAttribute('data-theme', theme);
        
        if (themeIcon) {
            if (theme === 'dark') {
                themeIcon.className = 'fas fa-sun';
                themeIcon.parentElement.title = 'Переключить на светлую тему';
            } else {
                themeIcon.className = 'fas fa-moon';
                themeIcon.parentElement.title = 'Переключить на темную тему';
            }
        }

        // Анимация переключения
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    // Утилиты для работы с данными
    static formatCurrency(amount) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0
        }).format(amount);
    }

    static formatDate(date) {
        return new Intl.DateTimeFormat('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date);
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Метод для обработки ошибок
    static handleError(error, context = 'Приложение') {
        console.error(`Ошибка в ${context}:`, error);
        
        // Можно добавить отправку ошибок на сервер аналитики
        // this.sendErrorToAnalytics(error, context);
    }

    // Получение информации о браузере для аналитики
    static getBrowserInfo() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            screenResolution: `${screen.width}x${screen.height}`,
            windowSize: `${window.innerWidth}x${window.innerHeight}`
        };
    }

    // Сохранение настроек пользователя
    static saveUserPreferences(preferences) {
        try {
            localStorage.setItem('userPreferences', JSON.stringify(preferences));
        } catch (error) {
            console.warn('Не удалось сохранить настройки пользователя:', error);
        }
    }

    // Загрузка настроек пользователя
    static loadUserPreferences() {
        try {
            const saved = localStorage.getItem('userPreferences');
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.warn('Не удалось загрузить настройки пользователя:', error);
            return {};
        }
    }
}

// Глобальные утилиты
window.UniGuideUtils = {
    formatCurrency: UniGuideApp.formatCurrency,
    formatDate: UniGuideApp.formatDate,
    debounce: UniGuideApp.debounce,
    throttle: UniGuideApp.throttle,
    handleError: UniGuideApp.handleError,
    getBrowserInfo: UniGuideApp.getBrowserInfo,
    saveUserPreferences: UniGuideApp.saveUserPreferences,
    loadUserPreferences: UniGuideApp.loadUserPreferences
};

// Инициализация приложения
const app = new UniGuideApp();

// Экспорт для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UniGuideApp;
}

// Service Worker для PWA (прогрессивное веб-приложение)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('SW зарегистрирован: ', registration);
            })
            .catch(registrationError => {
                console.log('SW регистрация не удалась: ', registrationError);
            });
    });
}

// Обработка ошибок JavaScript
window.addEventListener('error', (event) => {
    UniGuideApp.handleError(event.error, 'Глобальная ошибка');
});

window.addEventListener('unhandledrejection', (event) => {
    UniGuideApp.handleError(event.reason, 'Необработанное отклонение промиса');
});

// Аналитика (базовая)
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Время загрузки страницы: ${Math.round(loadTime)}ms`);
    
    // Отправка базовой аналитики
    const analyticsData = {
        page: window.location.pathname,
        loadTime: Math.round(loadTime),
        timestamp: new Date().toISOString(),
        browserInfo: UniGuideApp.getBrowserInfo()
    };
    
    // Здесь можно отправить данные на сервер аналитики
    console.log('Analytics data:', analyticsData);
});
