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

    // ...остальной код main.js...
}
// ...остальной код main.js...
