// ===== SEO UTILITIES =====
// Утилиты для работы с SEO метаданными

window.SEOUtils = {
  // Базовые настройки сайта
  siteConfig: {
    title: "Справочник абитуриента РГАУ-МСХА",
    description: "Полный гайд для поступающих в РГАУ-МСХА имени К.А. Тимирязева. Все этапы от подачи документов до адаптации в университете.",
    url: "https://rgau-guide.ru",
    image: "https://rgau-guide.ru/images/og-image.jpg",
    siteName: "Справочник РГАУ-МСХА",
    twitterHandle: "@rgau_guide",
    language: "ru",
    author: "Студенты РГАУ-МСХА",
    keywords: [
      "РГАУ-МСХА", 
      "абитуриент", 
      "поступление", 
      "университет", 
      "студент", 
      "Тимирязевка",
      "сельхозакадемия",
      "общежитие",
      "стипендия",
      "студенческие организации"
    ]
  },

  // Генерация метатегов для страницы
  generateMetaTags: function(pageData) {
    const config = this.siteConfig;
    const title = pageData.title ? `${pageData.title} | ${config.title}` : config.title;
    const description = pageData.description || config.description;
    const url = pageData.url ? `${config.url}${pageData.url}` : config.url;
    const image = pageData.image ? `${config.url}${pageData.image}` : config.image;
    const keywords = pageData.keywords ? 
      [...config.keywords, ...pageData.keywords].join(', ') : 
      config.keywords.join(', ');

    return {
      title,
      description,
      keywords,
      canonical: url,
      openGraph: {
        title,
        description,
        url,
        image,
        siteName: config.siteName,
        type: pageData.type || 'website',
        locale: config.language
      },
      twitter: {
        card: 'summary_large_image',
        site: config.twitterHandle,
        title,
        description,
        image
      },
      structuredData: this.generateStructuredData(pageData)
    };
  },

  // Генерация структурированных данных JSON-LD
  generateStructuredData: function(pageData) {
    const config = this.siteConfig;
    
    const baseData = {
      "@context": "https://schema.org",
      "@type": pageData.type === 'article' ? "Article" : "WebPage",
      "name": pageData.title || config.title,
      "description": pageData.description || config.description,
      "url": pageData.url ? `${config.url}${pageData.url}` : config.url,
      "inLanguage": config.language,
      "isPartOf": {
        "@type": "WebSite",
        "name": config.siteName,
        "url": config.url
      },
      "author": {
        "@type": "Organization",
        "name": config.author
      },
      "publisher": {
        "@type": "Organization",
        "name": config.siteName,
        "url": config.url
      }
    };

    // Дополнительные данные для статей
    if (pageData.type === 'article') {
      baseData.headline = pageData.title;
      baseData.datePublished = pageData.datePublished || "2024-12-12";
      baseData.dateModified = pageData.dateModified || "2024-12-12";
      if (pageData.image) {
        baseData.image = `${config.url}${pageData.image}`;
      }
    }

    // Для образовательного контента
    if (pageData.category === 'education') {
      return {
        ...baseData,
        "@type": "Course",
        "provider": {
          "@type": "Organization",
          "name": "РГАУ-МСХА имени К.А. Тимирязева",
          "url": "https://www.timacad.ru"
        }
      };
    }

    return baseData;
  },

  // Вставка метатегов в head
  insertMetaTags: function(pageData) {
    const meta = this.generateMetaTags(pageData);
    const head = document.head;

    // Основные метатеги
    this.updateOrCreateMeta('description', meta.description);
    this.updateOrCreateMeta('keywords', meta.keywords);
    this.updateOrCreateMeta('author', this.siteConfig.author);
    
    // Canonical URL
    this.updateOrCreateLink('canonical', meta.canonical);
    
    // Open Graph метатеги
    this.updateOrCreateMeta('og:title', meta.openGraph.title, 'property');
    this.updateOrCreateMeta('og:description', meta.openGraph.description, 'property');
    this.updateOrCreateMeta('og:url', meta.openGraph.url, 'property');
    this.updateOrCreateMeta('og:image', meta.openGraph.image, 'property');
    this.updateOrCreateMeta('og:site_name', meta.openGraph.siteName, 'property');
    this.updateOrCreateMeta('og:type', meta.openGraph.type, 'property');
    this.updateOrCreateMeta('og:locale', meta.openGraph.locale, 'property');
    
    // Twitter Card метатеги
    this.updateOrCreateMeta('twitter:card', meta.twitter.card);
    this.updateOrCreateMeta('twitter:site', meta.twitter.site);
    this.updateOrCreateMeta('twitter:title', meta.twitter.title);
    this.updateOrCreateMeta('twitter:description', meta.twitter.description);
    this.updateOrCreateMeta('twitter:image', meta.twitter.image);
    
    // Структурированные данные
    this.insertStructuredData(meta.structuredData);
    
    // Обновляем title
    document.title = meta.title;
  },

  // Вспомогательная функция для создания/обновления метатегов
  updateOrCreateMeta: function(name, content, attribute = 'name') {
    let meta = document.querySelector(`meta[${attribute}="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  },

  // Вспомогательная функция для создания/обновления link тегов
  updateOrCreateLink: function(rel, href) {
    let link = document.querySelector(`link[rel="${rel}"]`);
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', rel);
      document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  },

  // Вставка структурированных данных
  insertStructuredData: function(data) {
    // Удаляем существующие structured data
    const existing = document.querySelector('script[type="application/ld+json"]');
    if (existing) {
      existing.remove();
    }

    // Создаем новый script tag
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data, null, 2);
    document.head.appendChild(script);
  },

  // Функция для автоматической инициализации SEO на основе контента страницы
  autoInitSEO: function() {
    // Получаем данные страницы из различных источников
    const pageData = this.extractPageData();
    this.insertMetaTags(pageData);
  },

  // Извлечение данных страницы
  extractPageData: function() {
    const pathname = window.location.pathname;
    const breadcrumb = document.querySelector('.breadcrumb');
    const pageTitle = document.querySelector('.page-title, .hero-title, h1');
    const pageDescription = document.querySelector('.page-subtitle, .hero-subtitle, .page-description');
    
    let pageData = {
      url: pathname,
      title: pageTitle ? pageTitle.textContent.trim() : null,
      description: pageDescription ? pageDescription.textContent.trim() : null,
      type: 'website'
    };

    // Определяем тип страницы и категорию по URL
    if (pathname.includes('/applicant-path/')) {
      pageData.category = 'education';
      pageData.keywords = ['поступление', 'абитуриент', 'документы', 'зачисление'];
    } else if (pathname.includes('/university-life/')) {
      pageData.category = 'education';
      pageData.keywords = ['студенческая жизнь', 'общежитие', 'инфраструктура', 'учебный процесс'];
    } else if (pathname.includes('/scholarships/')) {
      pageData.category = 'education';
      pageData.keywords = ['стипендия', 'льготы', 'карта москвича', 'финансы'];
    } else if (pathname.includes('/organizations/')) {
      pageData.category = 'education';
      pageData.keywords = ['студенческие организации', 'клубы', 'активности', 'развитие'];
    } else if (pathname.includes('/military/')) {
      pageData.category = 'education';
      pageData.keywords = ['военная подготовка', 'отсрочка', 'ВУЦ', 'военкомат'];
    } else if (pathname.includes('/self-government/')) {
      pageData.category = 'education';
      pageData.keywords = ['самоуправление', 'староста', 'студенческий совет'];
    }

    return pageData;
  }
};

// Автоматическая инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  // Небольшая задержка, чтобы дать время другим скриптам загрузиться
  setTimeout(() => {
    if (window.SEOUtils) {
      window.SEOUtils.autoInitSEO();
    }
  }, 100);
});
