const fs = require('fs');
const path = require('path');

// Функция для рекурсивного поиска всех HTML файлов
function findHtmlFiles(dir, files = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            findHtmlFiles(fullPath, files);
        } else if (entry.isFile() && entry.name.endsWith('.html')) {
            files.push(fullPath);
        }
    }
    
    return files;
}

// Функция для проверки PWA элементов в файле
function checkPwaElements(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const relativePath = path.relative(path.join(__dirname), filePath);
        
        // Исключаем компоненты из проверки (они включаются в основные страницы)
        const isComponent = relativePath.includes('components' + path.sep);
        const isOfflinePage = relativePath.includes('offline.html');
        
        const checks = {
            manifest: content.includes('rel="manifest"'),
            themeColor: content.includes('name="theme-color"'),
            pwaCss: content.includes('pwa.css'),
            pwaJs: content.includes('pwa.js'),
            appleMeta: content.includes('apple-mobile-web-app-capable')
        };
        
        return {
            filePath: relativePath,
            isComponent,
            isOfflinePage,
            checks,
            isValid: isComponent || isOfflinePage || Object.values(checks).every(check => check)
        };
        
    } catch (error) {
        return {
            filePath: path.relative(path.join(__dirname), filePath),
            error: error.message,
            isValid: false
        };
    }
}

// Основная функция
function main() {
    console.log('🔍 Полная проверка PWA статуса всех HTML файлов...\n');
    
    const websiteDir = __dirname;
    const htmlFiles = findHtmlFiles(websiteDir);
    
    const results = htmlFiles.map(checkPwaElements);
    
    // Группировка результатов
    const validPages = results.filter(r => r.isValid && !r.isComponent);
    const invalidPages = results.filter(r => !r.isValid && !r.isComponent);
    const components = results.filter(r => r.isComponent);
    const offlinePages = results.filter(r => r.isOfflinePage);
    
    console.log('📊 РЕЗУЛЬТАТЫ ПРОВЕРКИ PWA:\n');
    
    console.log(`✅ Корректно настроенные страницы (${validPages.length}):`);
    validPages.forEach(page => {
        console.log(`   ✅ ${page.filePath}`);
    });
    
    if (invalidPages.length > 0) {
        console.log(`\n❌ Страницы с проблемами (${invalidPages.length}):`);
        invalidPages.forEach(page => {
            console.log(`   ❌ ${page.filePath}`);
            if (page.checks) {
                Object.entries(page.checks).forEach(([key, value]) => {
                    if (!value) {
                        console.log(`      - Отсутствует: ${key}`);
                    }
                });
            }
            if (page.error) {
                console.log(`      - Ошибка: ${page.error}`);
            }
        });
    }
    
    console.log(`\n📁 Компоненты (${components.length}) - пропущены при проверке:`);
    components.forEach(component => {
        console.log(`   📁 ${component.filePath}`);
    });
    
    if (offlinePages.length > 0) {
        console.log(`\n🔌 Офлайн страницы (${offlinePages.length}):`);
        offlinePages.forEach(page => {
            console.log(`   🔌 ${page.filePath}`);
        });
    }
    
    console.log('\n📈 СТАТИСТИКА:');
    console.log(`   📄 Всего HTML файлов: ${htmlFiles.length}`);
    console.log(`   ✅ Корректные страницы: ${validPages.length}`);
    console.log(`   ❌ Проблемные страницы: ${invalidPages.length}`);
    console.log(`   📁 Компоненты: ${components.length}`);
    console.log(`   🔌 Офлайн страницы: ${offlinePages.length}`);
    
    if (invalidPages.length === 0) {
        console.log('\n🎉 ВСЕ СТРАНИЦЫ КОРРЕКТНО НАСТРОЕНЫ ДЛЯ PWA!');
        console.log('✅ Ваш сайт готов к работе как Progressive Web App');
        console.log('\n📋 Следующие шаги:');
        console.log('1. Замените SVG-заглушку на настоящие иконки в manifest.json');
        console.log('2. Протестируйте PWA в браузере (F12 → Application)');
        console.log('3. Проверьте установку приложения и офлайн-режим');
    } else {
        console.log('\n⚠️  ОБНАРУЖЕНЫ ПРОБЛЕМЫ С PWA');
        console.log('Исправьте указанные выше проблемы для полной поддержки PWA');
    }
}

// Запуск
if (require.main === module) {
    main();
}

module.exports = { findHtmlFiles, checkPwaElements };
