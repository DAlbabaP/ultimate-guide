// ===== КАЛЬКУЛЯТОР СТИПЕНДИИ =====

const ScholarshipCalculator = {
  // Константы для расчетов (актуальные на 2024-2025 учебный год)
  RATES: {
    ACADEMIC_BASE: 2068, // Базовая академическая стипендия
    ACADEMIC_INCREASED: 4068, // Повышенная академическая стипендия
    SOCIAL_BASE: 3965, // Социальная стипендия
    ENHANCED_MIN: 8000, // Минимальная повышенная стипендия
    ENHANCED_MAX: 20000 // Максимальная повышенная стипендия
  },

  // Коэффициенты для расчета повышенной стипендии
  COEFFICIENTS: {
    EXCELLENT_GRADES: 1.5, // Отличные оценки
    SCIENCE_ACTIVITY: 1.3, // Научная деятельность
    CULTURAL_ACTIVITY: 1.2, // Культурная деятельность
    SPORTS_ACTIVITY: 1.2, // Спортивная деятельность
    SOCIAL_ACTIVITY: 1.1, // Общественная деятельность
    LEADERSHIP: 1.4 // Руководящие должности
  },

  // Элементы DOM
  elements: {
    form: null,
    result: null,
    recommendations: null
  },

  // Инициализация
  init() {
    this.findElements();
    this.bindEvents();
    console.log('💰 Калькулятор стипендии инициализирован');
  },

  // Поиск элементов в DOM
  findElements() {
    this.elements.form = document.getElementById('scholarship-calculator-form');
    this.elements.result = document.getElementById('scholarship-result');
    this.elements.recommendations = document.getElementById('scholarship-recommendations');
  },

  // Привязка событий
  bindEvents() {
    if (this.elements.form) {
      // Расчет при изменении любого поля
      const inputs = this.elements.form.querySelectorAll('input, select');
      inputs.forEach(input => {
        input.addEventListener('change', () => this.calculateScholarship());
        input.addEventListener('input', () => this.calculateScholarship());
      });

      // Расчет при отправке формы
      this.elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.calculateScholarship();
      });
    }
  },

  // Основная функция расчета стипендии
  calculateScholarship() {
    const formData = this.getFormData();
    
    if (!this.validateFormData(formData)) {
      this.showError('Пожалуйста, заполните все обязательные поля');
      return;
    }

    const result = this.performCalculation(formData);
    this.displayResult(result);
    this.generateRecommendations(formData, result);
  },

  // Получение данных из формы
  getFormData() {
    const form = this.elements.form;
    return {
      studyType: form.querySelector('[name="study-type"]')?.value,
      averageGrade: parseFloat(form.querySelector('[name="average-grade"]')?.value),
      hasExcellentGrades: form.querySelector('[name="excellent-grades"]')?.checked,
      socialCategory: form.querySelector('[name="social-category"]')?.value,
      scienceActivity: form.querySelector('[name="science-activity"]')?.checked,
      culturalActivity: form.querySelector('[name="cultural-activity"]')?.checked,
      sportsActivity: form.querySelector('[name="sports-activity"]')?.checked,
      socialActivity: form.querySelector('[name="social-activity"]')?.checked,
      leadershipRole: form.querySelector('[name="leadership-role"]')?.checked,
      studyYear: parseInt(form.querySelector('[name="study-year"]')?.value)
    };
  },

  // Валидация данных формы
  validateFormData(data) {
    return data.studyType && 
           !isNaN(data.averageGrade) && 
           data.averageGrade >= 3.0 && 
           data.averageGrade <= 5.0 &&
           data.studyYear;
  },

  // Выполнение расчетов
  performCalculation(data) {
    let totalAmount = 0;
    let breakdown = [];

    // Базовая академическая стипендия (только для бюджетников)
    if (data.studyType === 'budget') {
      if (data.averageGrade >= 4.0) {
        const academicAmount = data.hasExcellentGrades ? 
          this.RATES.ACADEMIC_INCREASED : this.RATES.ACADEMIC_BASE;
        
        totalAmount += academicAmount;
        breakdown.push({
          type: 'academic',
          name: data.hasExcellentGrades ? 'Академическая стипендия (повышенная)' : 'Академическая стипендия (базовая)',
          amount: academicAmount
        });
      }
    }

    // Социальная стипендия
    if (data.socialCategory === 'eligible') {
      totalAmount += this.RATES.SOCIAL_BASE;
      breakdown.push({
        type: 'social',
        name: 'Социальная стипендия',
        amount: this.RATES.SOCIAL_BASE
      });
    }

    // Повышенная стипендия за особые достижения
    if (data.studyType === 'budget' && data.averageGrade >= 4.5) {
      const enhancedAmount = this.calculateEnhancedScholarship(data);
      if (enhancedAmount > 0) {
        totalAmount += enhancedAmount;
        breakdown.push({
          type: 'enhanced',
          name: 'Повышенная стипендия за достижения',
          amount: enhancedAmount
        });
      }
    }

    return {
      totalAmount,
      breakdown,
      monthlyIncome: totalAmount,
      yearlyIncome: totalAmount * 10 // 10 месяцев выплат в году
    };
  },

  // Расчет повышенной стипендии за достижения
  calculateEnhancedScholarship(data) {
    let coefficient = 1.0;
    let activities = [];

    if (data.hasExcellentGrades) {
      coefficient *= this.COEFFICIENTS.EXCELLENT_GRADES;
      activities.push('отличная учеба');
    }

    if (data.scienceActivity) {
      coefficient *= this.COEFFICIENTS.SCIENCE_ACTIVITY;
      activities.push('научная деятельность');
    }

    if (data.culturalActivity) {
      coefficient *= this.COEFFICIENTS.CULTURAL_ACTIVITY;
      activities.push('культурная деятельность');
    }

    if (data.sportsActivity) {
      coefficient *= this.COEFFICIENTS.SPORTS_ACTIVITY;
      activities.push('спортивная деятельность');
    }

    if (data.socialActivity) {
      coefficient *= this.COEFFICIENTS.SOCIAL_ACTIVITY;
      activities.push('общественная деятельность');
    }

    if (data.leadershipRole) {
      coefficient *= this.COEFFICIENTS.LEADERSHIP;
      activities.push('руководящая роль');
    }

    // Базовая сумма для повышенной стипендии
    const baseAmount = this.RATES.ENHANCED_MIN;
    let enhancedAmount = Math.round(baseAmount * coefficient);

    // Ограничиваем максимальной суммой
    enhancedAmount = Math.min(enhancedAmount, this.RATES.ENHANCED_MAX);

    // Минимальный порог для получения повышенной стипендии
    return activities.length >= 2 ? enhancedAmount : 0;
  },

  // Отображение результата
  displayResult(result) {
    if (!this.elements.result) return;

    const resultHTML = `
      <div class="calculator-result">
        <div class="result-header">
          <div class="result-icon">💰</div>
          <div class="result-info">
            <h3>Ваша стипендия</h3>
            <div class="total-amount">${result.totalAmount.toLocaleString()} ₽ / месяц</div>
            <div class="yearly-amount">${result.yearlyIncome.toLocaleString()} ₽ / год</div>
          </div>
        </div>
        
        ${result.breakdown.length > 0 ? `
          <div class="result-breakdown">
            <h4>Детализация:</h4>
            <ul class="breakdown-list">
              ${result.breakdown.map(item => `
                <li class="breakdown-item breakdown-${item.type}">
                  <span class="item-name">${item.name}</span>
                  <span class="item-amount">${item.amount.toLocaleString()} ₽</span>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : `
          <div class="no-scholarship">
            <p>К сожалению, по указанным данным стипендия не назначается.</p>
          </div>
        `}
      </div>
    `;

    this.elements.result.innerHTML = resultHTML;
    this.elements.result.style.display = 'block';
  },

  // Генерация рекомендаций
  generateRecommendations(data, result) {
    if (!this.elements.recommendations) return;

    const recommendations = [];

    // Рекомендации по повышению стипендии
    if (data.studyType === 'budget') {
      if (data.averageGrade < 4.0) {
        recommendations.push({
          icon: '📚',
          title: 'Улучшите успеваемость',
          description: 'Для получения академической стипендии необходим средний балл от 4.0'
        });
      }

      if (data.averageGrade >= 4.0 && !data.hasExcellentGrades) {
        recommendations.push({
          icon: '⭐',
          title: 'Стремитесь к отличным оценкам',
          description: 'Отличники получают повышенную академическую стипендию'
        });
      }

      if (!data.scienceActivity) {
        recommendations.push({
          icon: '🔬',
          title: 'Участвуйте в научной деятельности',
          description: 'Научная работа увеличивает шансы на повышенную стипендию'
        });
      }

      if (!data.socialActivity) {
        recommendations.push({
          icon: '🤝',
          title: 'Займитесь общественной деятельностью',
          description: 'Участие в студенческих организациях дает дополнительные баллы'
        });
      }

      if (!data.leadershipRole) {
        recommendations.push({
          icon: '👨‍💼',
          title: 'Рассмотрите руководящие позиции',
          description: 'Старосты и активисты получают значительные надбавки'
        });
      }
    }

    // Рекомендации по социальной стипендии
    if (data.socialCategory !== 'eligible') {
      recommendations.push({
        icon: '🆘',
        title: 'Проверьте право на социальную поддержку',
        description: 'Если у вас есть льготы, обязательно подавайте документы на социальную стипендию'
      });
    }

    const recommendationsHTML = recommendations.length > 0 ? `
      <div class="calculator-recommendations">
        <h4>💡 Рекомендации по увеличению стипендии:</h4>
        <div class="recommendations-list">
          ${recommendations.map(rec => `
            <div class="recommendation-item">
              <div class="rec-icon">${rec.icon}</div>
              <div class="rec-content">
                <h5>${rec.title}</h5>
                <p>${rec.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : '';

    this.elements.recommendations.innerHTML = recommendationsHTML;
  },

  // Показать ошибку
  showError(message) {
    if (!this.elements.result) return;

    this.elements.result.innerHTML = `
      <div class="calculator-error">
        <div class="error-icon">⚠️</div>
        <p>${message}</p>
      </div>
    `;
    this.elements.result.style.display = 'block';
  },

  // Сброс калькулятора
  reset() {
    if (this.elements.form) {
      this.elements.form.reset();
    }
    if (this.elements.result) {
      this.elements.result.style.display = 'none';
    }
    if (this.elements.recommendations) {
      this.elements.recommendations.innerHTML = '';
    }
  }
};

// Экспорт для использования в других модулях
window.ScholarshipCalculator = ScholarshipCalculator;

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('scholarship-calculator-form')) {
    ScholarshipCalculator.init();
  }
});
