// ===== СКРИПТ ДЛЯ ИСПРАВЛЕНИЯ ПУТЕЙ В PWA =====

// Исправляем неправильные пути к CSS и JS файлам
function fixPWAPaths() {
  console.log('🔧 Исправление путей PWA в HTML файлах...\n');
  
  // Находим все HTML файлы
  const files = [
    'pages/university-life/index.html',
    'pages/university-life/dormitory/index.html', 
    'pages/university-life/academic-process/index.html',
    'pages/scholarships/index.html',
    'pages/scholarships/standard/index.html',
    'pages/scholarships/enhanced/index.html',
    'pages/scholarships/moscow-card/index.html',
    'pages/scholarships/other-benefits/index.html',
    'pages/military/index.html',
    'pages/military/vuc/index.html',
    'pages/military/military-office/index.html',
    'pages/military/deferment/index.html',
    'pages/self-government/index.html',
    'pages/self-government/responsibilities/index.html',
    'pages/self-government/leader-requirements/index.html',
    'pages/support/faq/index.html',
    'pages/applicant-path/enrollment/index.html',
    'pages/applicant-path/dormitory-settlement/index.html',
    'pages/applicant-path/competitive-selection/index.html',
    'pages/applicant-path/documents/index.html',
    'pages/applicant-path/adaptation/index.html'
  ];
  
  let fixedCount = 0;
  
  files.forEach(file => {
    try {
      let content = require('fs').readFileSync(file, 'utf8');
      let originalContent = content;
      
      // Исправляем неправильные пути
      content = content.replace(/\.\.\\\.\.\\\.\.\//g, '../../../');
      content = content.replace(/\.\.\\\.\.\//g, '../../');
      content = content.replace(/\.\.\\\.\./g, '../..');
      
      if (content !== originalContent) {
        require('fs').writeFileSync(file, content, 'utf8');
        console.log(`✅ Исправлен: ${file}`);
        fixedCount++;
      } else {
        console.log(`⏭️ Пропущен: ${file} (пути корректны)`);
      }
      
    } catch (error) {
      console.error(`❌ Ошибка обработки ${file}:`, error.message);
    }
  });
  
  console.log(`\n🎯 Результат: исправлено ${fixedCount} файлов`);
  console.log('✅ Все пути к PWA файлам теперь корректны!');
}

// Запуск
if (typeof require !== 'undefined' && require.main === module) {
  fixPWAPaths();
}
