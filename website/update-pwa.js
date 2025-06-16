// ===== СКРИПТ ДЛЯ ОБНОВЛЕНИЯ ВСЕХ HTML СТРАНИЦ С PWA ПОДДЕРЖКОЙ =====

const fs = require('fs');
const path = require('path');

// Функция для рекурсивного поиска HTML файлов
function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html') && file !== 'offline.html') {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Функция для определения относительного пути к корню
function getRelativePath(filePath) {
  const relativePath = path.relative(path.dirname(filePath), './');
  return relativePath === '' ? './' : relativePath + '/';
}

// Функция для обновления HTML файла
function updateHtmlFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  const basePath = getRelativePath(filePath);
  
  // Добавляем PWA мета-теги, если их нет
  if (!content.includes('theme-color')) {
    const metaInsert = `    <!-- PWA мета-теги -->
    <meta name="theme-color" content="#2F5E2F">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    
    `;
    
    content = content.replace(
      /(\s+<!-- Open Graph)/,
      metaInsert + '$1'
    );
    updated = true;
  }
  
  // Добавляем ссылку на PWA CSS, если её нет
  if (!content.includes('pwa.css')) {
    const cssPath = basePath + 'css/pwa.css';
    const cssLink = `    <link rel="stylesheet" href="${cssPath}">`;
    
    // Ищем последний CSS файл и добавляем после него
    const lastCssMatch = content.match(/.*<link rel="stylesheet" href="[^"]*\.css"[^>]*>/g);
    if (lastCssMatch) {
      const lastCss = lastCssMatch[lastCssMatch.length - 1];
      content = content.replace(lastCss, lastCss + '\n' + cssLink);
      updated = true;
    }
  }
  
  // Добавляем PWA скрипт, если его нет
  if (!content.includes('pwa.js')) {
    const jsPath = basePath + 'js/pwa.js';
    const jsScript = `    <script src="${jsPath}"></script>`;
    
    // Ищем main.js и добавляем PWA скрипт перед ним
    if (content.includes('main.js')) {
      content = content.replace(
        /(\s+<script src="[^"]*main\.js"><\/script>)/,
        '\n' + jsScript + '$1'
      );
      updated = true;
    }
  }
  
  // Сохраняем файл, если были изменения
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Обновлен: ${filePath}`);
  } else {
    console.log(`⏭️ Пропущен: ${filePath} (уже обновлен)`);
  }
}

// Основная функция
function main() {
  console.log('🔄 Начинаем обновление HTML файлов для PWA...\n');
  
  const websiteDir = './';
  const htmlFiles = findHtmlFiles(websiteDir);
  
  console.log(`📁 Найдено ${htmlFiles.length} HTML файлов:\n`);
  
  htmlFiles.forEach(file => {
    try {
      updateHtmlFile(file);
    } catch (error) {
      console.error(`❌ Ошибка обработки ${file}:`, error.message);
    }
  });
  
  console.log('\n✅ Обновление завершено!');
  console.log('\n📝 Что было добавлено:');
  console.log('- PWA мета-теги (theme-color, apple-mobile-web-app)');
  console.log('- Ссылка на css/pwa.css');
  console.log('- Скрипт js/pwa.js');
  console.log('\n🚀 Теперь все страницы поддерживают PWA функциональность!');
}

// Запускаем если файл выполняется напрямую
if (require.main === module) {
  main();
}

module.exports = { updateHtmlFile, findHtmlFiles };
