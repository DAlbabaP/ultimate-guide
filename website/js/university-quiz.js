// ===== ТЕСТ "ПОДХОДИТ ЛИ МНЕ РГАУ-МСХА?" =====

const UniversityQuiz = {
  // База вопросов теста
  QUESTIONS: [
    {
      id: 1,
      type: 'single',
      question: 'Какая сфера деятельности вас больше всего привлекает?',
      answers: [
        { id: 'a', text: 'Сельское хозяйство и агробизнес', scores: { agro: 3, tech: 1, eco: 2, vet: 1 } },
        { id: 'b', text: 'Технологии и инновации', scores: { tech: 3, agro: 1, eco: 1, bio: 2 } },
        { id: 'c', text: 'Экономика и управление', scores: { eco: 3, agro: 1, tech: 1, management: 2 } },
        { id: 'd', text: 'Биология и экология', scores: { bio: 3, vet: 2, agro: 1, eco: 1 } },
        { id: 'e', text: 'Ветеринария и зоотехния', scores: { vet: 3, bio: 2, agro: 1 } }
      ]
    },
    {
      id: 2,
      type: 'single',
      question: 'Где бы вы предпочли работать после окончания университета?',
      answers: [
        { id: 'a', text: 'На природе, в полевых условиях', scores: { agro: 3, bio: 2, vet: 2 } },
        { id: 'b', text: 'В современном офисе', scores: { eco: 3, management: 2, tech: 1 } },
        { id: 'c', text: 'В лаборатории', scores: { bio: 3, tech: 2, vet: 1 } },
        { id: 'd', text: 'На производстве', scores: { tech: 3, agro: 2, eco: 1 } },
        { id: 'e', text: 'В ветеринарной клинике', scores: { vet: 3, bio: 1 } }
      ]
    },
    {
      id: 3,
      type: 'single',
      question: 'Какой стиль обучения вам ближе?',
      answers: [
        { id: 'a', text: 'Практические занятия и эксперименты', scores: { agro: 2, bio: 3, vet: 2, tech: 2 } },
        { id: 'b', text: 'Теоретические лекции и исследования', scores: { bio: 2, eco: 2, tech: 1 } },
        { id: 'c', text: 'Проектная работа в команде', scores: { management: 3, eco: 2, tech: 2 } },
        { id: 'd', text: 'Индивидуальные исследования', scores: { bio: 2, tech: 2, agro: 1 } }
      ]
    },
    {
      id: 4,
      type: 'multiple',
      question: 'Какие предметы в школе вам нравились больше всего? (можно выбрать несколько)',
      answers: [
        { id: 'a', text: 'Биология', scores: { bio: 2, vet: 2, agro: 1 } },
        { id: 'b', text: 'Химия', scores: { bio: 2, tech: 2, agro: 1 } },
        { id: 'c', text: 'Математика', scores: { tech: 2, eco: 2 } },
        { id: 'd', text: 'Физика', scores: { tech: 3, agro: 1 } },
        { id: 'e', text: 'География', scores: { agro: 2, bio: 1, eco: 1 } },
        { id: 'f', text: 'Обществознание', scores: { eco: 2, management: 2 } }
      ]
    },
    {
      id: 5,
      type: 'single',
      question: 'Что для вас важнее в будущей профессии?',
      answers: [
        { id: 'a', text: 'Помощь людям и животным', scores: { vet: 3, bio: 2, agro: 1 } },
        { id: 'b', text: 'Высокий доход', scores: { eco: 3, management: 2, tech: 1 } },
        { id: 'c', text: 'Творческая самореализация', scores: { bio: 2, tech: 2, agro: 1 } },
        { id: 'd', text: 'Стабильность и надежность', scores: { agro: 2, eco: 2, management: 1 } },
        { id: 'e', text: 'Возможность инноваций', scores: { tech: 3, bio: 2, agro: 1 } }
      ]
    },
    {
      id: 6,
      type: 'single',
      question: 'Как вы относитесь к работе с животными?',
      answers: [
        { id: 'a', text: 'Обожаю животных, готов(а) посвятить им карьеру', scores: { vet: 3, bio: 1 } },
        { id: 'b', text: 'Нравится, но не основной интерес', scores: { agro: 2, bio: 1 } },
        { id: 'c', text: 'Нейтрально отношусь', scores: { eco: 1, tech: 1, management: 1 } },
        { id: 'd', text: 'Предпочитаю не работать с животными', scores: { tech: 2, eco: 2, management: 2 } }
      ]
    }
  ],

  // Факультеты и направления
  FACULTIES: {
    agro: {
      name: 'Агрономический факультет',
      description: 'Растениеводство, агротехнологии, селекция',
      specialties: ['Агрономия', 'Селекция и генетика', 'Агрохимия'],
      prospects: 'Работа в агрохолдингах, селекционных центрах, собственный агробизнес'
    },
    tech: {
      name: 'Факультет технического сервиса',
      description: 'Инженерные технологии, техника, автоматизация',
      specialties: ['Агроинженерия', 'Техносферная безопасность', 'Автоматизация'],
      prospects: 'IT-компании, инженерные фирмы, производственные предприятия'
    },
    eco: {
      name: 'Экономический факультет',
      description: 'Экономика, финансы, бухгалтерский учет',
      specialties: ['Экономика', 'Менеджмент', 'Бухгалтерский учет'],
      prospects: 'Банки, консалтинг, государственные структуры, бизнес'
    },
    bio: {
      name: 'Факультет биотехнологии и стандартизации',
      description: 'Биотехнологии, пищевые технологии, экология',
      specialties: ['Биотехнология', 'Технология продуктов питания', 'Экология'],
      prospects: 'Научные институты, пищевая промышленность, экологические организации'
    },
    vet: {
      name: 'Факультет ветеринарной медицины и биотехнологии',
      description: 'Ветеринария, зоотехния, кинология',
      specialties: ['Ветеринария', 'Зоотехния', 'Кинология'],
      prospects: 'Ветклиники, зоопарки, животноводческие предприятия'
    },
    management: {
      name: 'Институт экономики и управления',
      description: 'Управление, государственное администрирование',
      specialties: ['Государственное управление', 'Управление персоналом'],
      prospects: 'Государственная служба, крупные корпорации, консалтинг'
    }
  },

  // Элементы DOM
  elements: {
    modal: null,
    startButton: null
  },

  // Состояние теста
  currentQuestion: 0,
  answers: {},
  scores: {},
  isActive: false,

  // Инициализация
  init() {
    this.findElements();
    this.createQuizModal();
    this.bindEvents();
    console.log('🎯 Тест "Подходит ли мне РГАУ-МСХА?" инициализирован');
  },

  // Поиск элементов
  findElements() {
    this.elements.startButton = document.getElementById('startQuizBtn');
  },

  // Создание модального окна теста
  createQuizModal() {
    const modal = document.createElement('div');
    modal.id = 'quizModal';
    modal.className = 'quiz-modal';
    modal.innerHTML = `
      <div class="quiz-modal-content">
        <div class="quiz-header">
          <h3 class="quiz-title">Подходит ли мне РГАУ-МСХА?</h3>
          <button class="quiz-close" id="closeQuizBtn">&times;</button>
        </div>
        <div class="quiz-body" id="quizBody">
          <!-- Контент теста будет добавлен динамически -->
        </div>
        <div class="quiz-footer" id="quizFooter">
          <!-- Кнопки навигации будут добавлены динамически -->
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    this.elements.modal = modal;
  },

  // Привязка событий
  bindEvents() {
    if (this.elements.startButton) {
      this.elements.startButton.addEventListener('click', () => {
        this.startQuiz();
      });
    }

    // Закрытие модального окна
    document.addEventListener('click', (e) => {
      if (e.target.id === 'closeQuizBtn' || e.target.id === 'quizModal') {
        this.closeQuiz();
      }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isActive) {
        this.closeQuiz();
      }
    });
  },

  // Запуск теста
  startQuiz() {
    this.resetQuiz();
    this.isActive = true;
    this.elements.modal.style.display = 'flex';
    this.showQuestion(0);
    document.body.style.overflow = 'hidden';
  },

  // Сброс теста
  resetQuiz() {
    this.currentQuestion = 0;
    this.answers = {};
    this.scores = {
      agro: 0,
      tech: 0,
      eco: 0,
      bio: 0,
      vet: 0,
      management: 0
    };
  },

  // Показать вопрос
  showQuestion(questionIndex) {
    const question = this.QUESTIONS[questionIndex];
    const body = document.getElementById('quizBody');
    const footer = document.getElementById('quizFooter');

    // Прогресс-бар
    const progress = Math.round(((questionIndex + 1) / this.QUESTIONS.length) * 100);

    body.innerHTML = `
      <div class="quiz-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
        <div class="progress-text">Вопрос ${questionIndex + 1} из ${this.QUESTIONS.length}</div>
      </div>
      
      <div class="question-container">
        <h4 class="question-text">${question.question}</h4>
        <div class="answers-container">
          ${question.answers.map(answer => `
            <label class="answer-option">
              <input 
                type="${question.type === 'multiple' ? 'checkbox' : 'radio'}" 
                name="question-${question.id}" 
                value="${answer.id}"
                ${this.isAnswerSelected(question.id, answer.id) ? 'checked' : ''}
              >
              <span class="answer-text">${answer.text}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;

    // Кнопки навигации
    footer.innerHTML = `
      <div class="quiz-navigation">
        ${questionIndex > 0 ? 
          '<button class="quiz-btn quiz-btn-secondary" id="prevQuestionBtn">Назад</button>' : 
          ''
        }
        <button class="quiz-btn quiz-btn-primary" id="nextQuestionBtn" ${!this.hasAnswerForQuestion(question.id) ? 'disabled' : ''}>
          ${questionIndex === this.QUESTIONS.length - 1 ? 'Получить результат' : 'Далее'}
        </button>
      </div>
    `;

    this.bindQuestionEvents(question);
  },

  // Привязка событий для вопроса
  bindQuestionEvents(question) {
    const inputs = document.querySelectorAll(`input[name="question-${question.id}"]`);
    const nextBtn = document.getElementById('nextQuestionBtn');
    const prevBtn = document.getElementById('prevQuestionBtn');

    // Обработка ответов
    inputs.forEach(input => {
      input.addEventListener('change', () => {
        this.saveAnswer(question);
        nextBtn.disabled = false;
      });
    });

    // Навигация
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.saveAnswer(question);
        if (this.currentQuestion === this.QUESTIONS.length - 1) {
          this.showResults();
        } else {
          this.currentQuestion++;
          this.showQuestion(this.currentQuestion);
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.currentQuestion--;
        this.showQuestion(this.currentQuestion);
      });
    }
  },

  // Сохранение ответа
  saveAnswer(question) {
    const inputs = document.querySelectorAll(`input[name="question-${question.id}"]:checked`);
    const selectedAnswers = Array.from(inputs).map(input => input.value);
    
    this.answers[question.id] = selectedAnswers;
    
    // Подсчет баллов
    selectedAnswers.forEach(answerId => {
      const answer = question.answers.find(a => a.id === answerId);
      if (answer && answer.scores) {
        Object.keys(answer.scores).forEach(faculty => {
          this.scores[faculty] = (this.scores[faculty] || 0) + answer.scores[faculty];
        });
      }
    });
  },

  // Проверка наличия ответа на вопрос
  hasAnswerForQuestion(questionId) {
    return this.answers[questionId] && this.answers[questionId].length > 0;
  },

  // Проверка выбран ли ответ
  isAnswerSelected(questionId, answerId) {
    const questionAnswers = this.answers[questionId];
    return questionAnswers && questionAnswers.includes(answerId);
  },

  // Показать результаты
  showResults() {
    const body = document.getElementById('quizBody');
    const footer = document.getElementById('quizFooter');

    // Сортировка факультетов по баллам
    const sortedFaculties = Object.keys(this.scores)
      .map(key => ({
        key,
        score: this.scores[key],
        faculty: this.FACULTIES[key]
      }))
      .sort((a, b) => b.score - a.score)
      .filter(item => item.score > 0);

    const topFaculty = sortedFaculties[0];
    const maxScore = Math.max(...Object.values(this.scores));
    const suitabilityPercent = Math.min(Math.round((maxScore / 15) * 100), 100);

    body.innerHTML = `
      <div class="quiz-results">
        <div class="results-header">
          <div class="suitability-circle">
            <div class="circle-progress" style="--percent: ${suitabilityPercent}">
              <span class="percent-text">${suitabilityPercent}%</span>
            </div>
          </div>
          <h4 class="results-title">
            ${suitabilityPercent >= 70 ? '🎉 РГАУ-МСХА отлично вам подходит!' :
              suitabilityPercent >= 50 ? '👍 РГАУ-МСХА может быть хорошим выбором!' :
              '🤔 Стоит внимательно изучить программы'}
          </h4>
        </div>

        <div class="recommended-faculty">
          <h5>🎯 Рекомендуемое направление:</h5>
          <div class="faculty-card featured">
            <h6>${topFaculty.faculty.name}</h6>
            <p>${topFaculty.faculty.description}</p>
            <div class="faculty-details">
              <div class="specialties">
                <strong>Специальности:</strong>
                <ul>
                  ${topFaculty.faculty.specialties.map(spec => `<li>${spec}</li>`).join('')}
                </ul>
              </div>
              <div class="prospects">
                <strong>Карьерные перспективы:</strong>
                <p>${topFaculty.faculty.prospects}</p>
              </div>
            </div>
          </div>
        </div>

        ${sortedFaculties.length > 1 ? `
          <div class="other-faculties">
            <h5>📚 Другие подходящие направления:</h5>
            ${sortedFaculties.slice(1, 3).map(item => `
              <div class="faculty-card">
                <h6>${item.faculty.name}</h6>
                <p>${item.faculty.description}</p>
                <div class="compatibility">Совместимость: ${Math.round((item.score / maxScore) * 100)}%</div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div class="next-steps">
          <h5>🚀 Следующие шаги:</h5>
          <ol class="steps-list">
            <li>Изучите программы рекомендованных факультетов</li>
            <li>Посетите дни открытых дверей</li>
            <li>Ознакомьтесь с условиями поступления</li>
            <li>Подготовьтесь к вступительным экзаменам</li>
          </ol>
        </div>
      </div>
    `;

    footer.innerHTML = `
      <div class="quiz-navigation">
        <button class="quiz-btn quiz-btn-secondary" id="restartQuizBtn">Пройти еще раз</button>
        <button class="quiz-btn quiz-btn-primary" id="closeResultsBtn">Изучить университет</button>
      </div>
    `;

    // События для кнопок результатов
    document.getElementById('restartQuizBtn')?.addEventListener('click', () => {
      this.startQuiz();
    });

    document.getElementById('closeResultsBtn')?.addEventListener('click', () => {
      this.closeQuiz();
      // Прокрутка к разделам факультетов
      document.getElementById('main-sections')?.scrollIntoView({ behavior: 'smooth' });
    });
  },

  // Закрытие теста
  closeQuiz() {
    this.isActive = false;
    this.elements.modal.style.display = 'none';
    document.body.style.overflow = '';
  },

  // Уничтожение виджета
  destroy() {
    if (this.elements.modal) {
      document.body.removeChild(this.elements.modal);
    }
    console.log('🎯 Тест "Подходит ли мне РГАУ-МСХА?" уничтожен');
  }
};

// Экспорт для использования в других модулях
window.UniversityQuiz = UniversityQuiz;

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('startQuizBtn')) {
    UniversityQuiz.init();
  }
});
