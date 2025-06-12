// ===== ИНТЕРАКТИВНЫЕ ВИДЖЕТЫ =====

class WidgetManager {
    constructor() {
        this.initializeWidgets();
    }

    initializeWidgets() {
        this.initScholarshipCalculator();
        this.initDocumentsChecklist();
        this.initBudgetPlanner();
        this.initImportantDates();
        this.initUserTypeSelector();
        this.initProgressCounter();
    }

    // Калькулятор стипендии
    initScholarshipCalculator() {
        const gpaInput = document.getElementById('gpa');
        const gpaRange = document.getElementById('gpaRange');
        const scholarshipAmount = document.getElementById('scholarshipAmount');
        const scholarshipNote = document.getElementById('scholarshipNote');

        if (!gpaInput || !gpaRange) return;

        const calculateScholarship = (gpa) => {
            const gpaFloat = parseFloat(gpa);
            let amount, note;

            if (gpaFloat < 4.0) {
                amount = 0;
                note = 'Стипендия не выплачивается (средний балл менее 4.0)';
            } else if (gpaFloat >= 4.0 && gpaFloat < 4.5) {
                amount = 2712;
                note = 'Стандартная стипендия (хорошая успеваемость)';
            } else if (gpaFloat >= 4.5 && gpaFloat < 5.0) {
                amount = 3391;
                note = 'Повышенная стипендия (отличная успеваемость)';
            } else if (gpaFloat === 5.0) {
                amount = 4068;
                note = 'Максимальная стипендия (абсолютно отличная успеваемость)';
            }

            return { amount, note };
        };

        const updateCalculator = (value) => {
            const result = calculateScholarship(value);
            
            if (scholarshipAmount) {
                scholarshipAmount.textContent = result.amount > 0 ? `${result.amount.toLocaleString()} ₽` : '0 ₽';
                scholarshipAmount.style.color = result.amount > 0 ? 'var(--primary-green)' : 'var(--danger)';
            }
            
            if (scholarshipNote) {
                scholarshipNote.textContent = result.note;
                scholarshipNote.style.color = result.amount > 0 ? 'var(--blue)' : 'var(--danger)';
            }
        };

        // Синхронизация input и range
        gpaInput.addEventListener('input', (e) => {
            const value = e.target.value;
            gpaRange.value = value;
            updateCalculator(value);
        });

        gpaRange.addEventListener('input', (e) => {
            const value = e.target.value;
            gpaInput.value = value;
            updateCalculator(value);
        });

        // Инициализация
        updateCalculator(gpaInput.value);
    }

    // Чек-лист документов
    initDocumentsChecklist() {
        const checklist = document.getElementById('documentsChecklist');
        const progressFill = document.getElementById('checklistProgress');
        const progressPercent = document.getElementById('progressPercent');

        if (!checklist) return;

        const updateProgress = () => {
            const checkboxes = checklist.querySelectorAll('input[type="checkbox"]');
            const checkedBoxes = checklist.querySelectorAll('input[type="checkbox"]:checked');
            const progress = (checkedBoxes.length / checkboxes.length) * 100;

            if (progressFill) {
                progressFill.style.width = `${progress}%`;
            }

            if (progressPercent) {
                progressPercent.textContent = `${Math.round(progress)}%`;
            }

            // Добавляем визуальную обратную связь
            if (progress === 100) {
                checklist.style.border = '2px solid var(--success)';
                if (progressPercent) {
                    progressPercent.style.color = 'var(--success)';
                    progressPercent.textContent = '100% - Готово! ✓';
                }
            } else {
                checklist.style.border = '';
                if (progressPercent) {
                    progressPercent.style.color = '';
                }
            }
        };

        // Добавляем обработчики на все чекбоксы
        const checkboxes = checklist.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateProgress);
            
            // Добавляем анимацию при изменении
            checkbox.addEventListener('change', (e) => {
                const item = e.target.closest('.checklist__item');
                if (e.target.checked) {
                    item.style.background = 'rgba(47, 94, 47, 0.1)';
                    item.style.transform = 'scale(1.02)';
                    setTimeout(() => {
                        item.style.transform = '';
                    }, 200);
                } else {
                    item.style.background = '';
                }
            });
        });

        // Загрузка сохраненного состояния
        this.loadChecklistState();
        updateProgress();

        // Сохранение состояния при изменении
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.saveChecklistState());
        });
    }

    // Сохранение состояния чек-листа в localStorage
    saveChecklistState() {
        const checklist = document.getElementById('documentsChecklist');
        if (!checklist) return;

        const checkboxes = checklist.querySelectorAll('input[type="checkbox"]');
        const state = {};
        
        checkboxes.forEach(checkbox => {
            state[checkbox.id] = checkbox.checked;
        });

        localStorage.setItem('checklistState', JSON.stringify(state));
    }

    // Загрузка состояния чек-листа из localStorage
    loadChecklistState() {
        const saved = localStorage.getItem('checklistState');
        if (!saved) return;

        try {
            const state = JSON.parse(saved);
            Object.entries(state).forEach(([id, checked]) => {
                const checkbox = document.getElementById(id);
                if (checkbox) {
                    checkbox.checked = checked;
                    if (checked) {
                        const item = checkbox.closest('.checklist__item');
                        item.style.background = 'rgba(47, 94, 47, 0.1)';
                    }
                }
            });
        } catch (e) {
            console.error('Ошибка загрузки состояния чек-листа:', e);
        }
    }

    // Планировщик бюджета
    initBudgetPlanner() {
        const budgetItems = document.querySelectorAll('.budget__item');
        const budgetTotal = document.querySelector('.budget__total');

        if (!budgetItems.length) return;

        // Делаем планировщик интерактивным
        budgetItems.forEach(item => {
            const amount = item.querySelector('.budget__amount');
            if (!amount) return;

            // Добавляем возможность редактирования
            amount.addEventListener('click', () => {
                const currentValue = amount.textContent.replace(/[^\d]/g, '');
                const input = document.createElement('input');
                input.type = 'number';
                input.value = currentValue;
                input.className = 'budget-edit-input';
                input.style.cssText = `
                    width: 80px;
                    padding: 2px 4px;
                    border: 1px solid var(--primary-green);
                    border-radius: 4px;
                    font-size: 0.9rem;
                `;

                const originalText = amount.textContent;
                amount.textContent = '';
                amount.appendChild(input);
                input.focus();
                input.select();

                const saveValue = () => {
                    const newValue = parseInt(input.value) || 0;
                    amount.textContent = `${newValue.toLocaleString()} ₽`;
                    this.updateBudgetTotal();
                };

                const cancelEdit = () => {
                    amount.textContent = originalText;
                };

                input.addEventListener('blur', saveValue);
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        saveValue();
                    } else if (e.key === 'Escape') {
                        cancelEdit();
                    }
                });
            });

            // Добавляем подсказку
            item.title = 'Нажмите на сумму для редактирования';
            item.style.cursor = 'pointer';
        });

        this.updateBudgetTotal();
    }

    // Обновление общей суммы бюджета
    updateBudgetTotal() {
        const budgetItems = document.querySelectorAll('.budget__amount');
        const budgetTotal = document.querySelector('.budget__total');

        if (!budgetTotal) return;

        let total = 0;
        budgetItems.forEach(item => {
            const amount = parseInt(item.textContent.replace(/[^\d]/g, '')) || 0;
            total += amount;
        });

        budgetTotal.innerHTML = `<strong>Итого: ${total.toLocaleString()} ₽/месяц</strong>`;

        // Добавляем цветовую индикацию
        if (total > 15000) {
            budgetTotal.style.color = 'var(--danger)';
        } else if (total > 12000) {
            budgetTotal.style.color = 'var(--warning)';
        } else {
            budgetTotal.style.color = 'var(--success)';
        }
    }

    // Важные даты с обратным отсчетом
    initImportantDates() {
        const dateItems = document.querySelectorAll('.date__item');
        
        dateItems.forEach(item => {
            const dayElement = item.querySelector('.date__day');
            const eventElement = item.querySelector('.date__event');
            
            if (!dayElement || !eventElement) return;

            const day = parseInt(dayElement.textContent);
            const monthText = item.querySelector('.date__month').textContent;
            const eventText = eventElement.textContent;

            // Определяем месяц
            const monthMap = {
                'июня': 5, 'июля': 6, 'августа': 7, 'сентября': 8
            };
            const month = monthMap[monthText];

            if (month !== undefined) {
                const eventDate = new Date(2025, month, day);
                const now = new Date();
                const timeDiff = eventDate.getTime() - now.getTime();
                const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

                // Добавляем индикатор времени
                if (daysDiff < 0) {
                    item.style.opacity = '0.6';
                    eventElement.innerHTML = `${eventText} <small>(прошло)</small>`;
                } else if (daysDiff === 0) {
                    item.style.background = 'var(--warning)';
                    item.style.color = 'var(--white)';
                    eventElement.innerHTML = `${eventText} <small>(сегодня!)</small>`;
                } else if (daysDiff <= 7) {
                    item.style.background = 'var(--danger)';
                    item.style.color = 'var(--white)';
                    eventElement.innerHTML = `${eventText} <small>(через ${daysDiff} дн.)</small>`;
                } else if (daysDiff <= 30) {
                    item.style.background = 'var(--warning)';
                    eventElement.innerHTML = `${eventText} <small>(через ${daysDiff} дн.)</small>`;
                } else {
                    eventElement.innerHTML = `${eventText} <small>(через ${daysDiff} дн.)</small>`;
                }
            }
        });
    }

    // Селектор типа пользователя
    initUserTypeSelector() {
        const selectorButtons = document.querySelectorAll('.selector__btn');
        
        if (!selectorButtons.length) return;

        // Загружаем сохраненный тип пользователя
        const savedUserType = localStorage.getItem('userType') || 'applicant';
        this.setUserType(savedUserType);

        selectorButtons.forEach(button => {
            button.addEventListener('click', () => {
                const userType = button.dataset.type;
                this.setUserType(userType);
                localStorage.setItem('userType', userType);
            });
        });
    }

    // Установка типа пользователя
    setUserType(userType) {
        // Обновляем активную кнопку
        const selectorButtons = document.querySelectorAll('.selector__btn');
        selectorButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === userType);
        });

        // Персонализируем контент
        this.personalizeContent(userType);
    }

    // Персонализация контента
    personalizeContent(userType) {
        const heroDescription = document.querySelector('.hero__description');
        const timelineItems = document.querySelectorAll('.timeline__item');
        
        const personalizations = {
            applicant: {
                description: 'Все что нужно знать для успешного поступления в Тимирязевскую академию. От подачи документов до первых дней студенческой жизни.',
                highlightSteps: ['june', 'july', 'august']
            },
            freshman: {
                description: 'Добро пожаловать в Тимирязевскую академию! Здесь вы найдете всю информацию для успешной адаптации к студенческой жизни.',
                highlightSteps: ['late-august', 'september']
            },
            student: {
                description: 'Полный справочник студента Тимирязевской академии. Стипендии, организации, возможности развития и многое другое.',
                highlightSteps: []
            },
            parent: {
                description: 'Подробное руководство для родителей абитуриентов. Все этапы поступления, финансовые вопросы и студенческая жизнь.',
                highlightSteps: ['june', 'july', 'august', 'late-august']
            }
        };

        const personalization = personalizations[userType];
        
        if (heroDescription && personalization) {
            heroDescription.textContent = personalization.description;
        }

        // Подсвечиваем релевантные этапы
        timelineItems.forEach(item => {
            const month = item.dataset.month;
            if (personalization.highlightSteps.includes(month)) {
                item.style.transform = 'scale(1.02)';
                item.style.boxShadow = '0 8px 24px rgba(47, 94, 47, 0.2)';
                item.style.borderLeft = '4px solid var(--primary-green)';
            } else {
                item.style.transform = '';
                item.style.boxShadow = '';
                item.style.borderLeft = '';
            }
        });
    }

    // Счетчик дней до начала учебы
    initProgressCounter() {
        const daysCounter = document.getElementById('daysCounter');
        if (!daysCounter) return;

        const startDate = new Date(2025, 8, 1); // 1 сентября 2025
        const now = new Date();
        const timeDiff = startDate.getTime() - now.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (daysDiff > 0) {
            daysCounter.textContent = `${daysDiff} дней`;
        } else if (daysDiff === 0) {
            daysCounter.textContent = 'Сегодня!';
            daysCounter.style.color = 'var(--warning)';
        } else {
            daysCounter.textContent = 'Учеба началась';
            daysCounter.parentElement.querySelector('.progress-label').textContent = 'Учебный год';
        }

        // Анимированное обновление каждые 24 часа
        setInterval(() => {
            this.initProgressCounter();
        }, 24 * 60 * 60 * 1000);
    }

    // Уведомления о важных датах
    checkImportantDates() {
        const now = new Date();
        const importantDates = [
            { date: new Date(2025, 6, 20), message: 'Завтра крайний срок подачи документов!' },
            { date: new Date(2025, 6, 27), message: 'Сегодня публикуются конкурсные списки!' },
            { date: new Date(2025, 7, 27), message: 'Сегодня начинается заселение в общежитие!' }
        ];

        importantDates.forEach(({ date, message }) => {
            const timeDiff = date.getTime() - now.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if (daysDiff === 1) {
                this.showNotification(message, 'warning');
            } else if (daysDiff === 0) {
                this.showNotification(message, 'danger');
            }
        });
    }

    // Показ уведомлений
    showNotification(message, type = 'info') {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <i class="fas fa-${type === 'danger' ? 'exclamation-triangle' : type === 'warning' ? 'clock' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification__close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Добавляем стили
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--${type === 'danger' ? 'danger' : type === 'warning' ? 'warning' : 'info'});
            color: var(--white);
            padding: 1rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1001;
            max-width: 300px;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Автоматическое скрытие через 5 секунд
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);

        // Закрытие по клику
        notification.querySelector('.notification__close').addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }
}

// Добавляем CSS анимации для уведомлений
const notificationStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .notification {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }

    .notification__content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .notification__close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 0.25rem;
        opacity: 0.8;
        transition: opacity 0.2s ease;
    }

    .notification__close:hover {
        opacity: 1;
    }
`;

const notificationStyleSheet = document.createElement('style');
notificationStyleSheet.textContent = notificationStyles;
document.head.appendChild(notificationStyleSheet);

// Экспортируем класс
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WidgetManager;
}
