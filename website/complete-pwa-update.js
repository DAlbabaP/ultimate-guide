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

// Функция для вычисления относительного пути к корню сайта
function getRelativePathToRoot(filePath) {
    const relativePath = path.relative(path.join(__dirname), filePath);
    const depth = relativePath.split(path.sep).length - 1;
    
    if (depth === 0) {
        return './'; // Для файлов в корне
    }
    
    return '../'.repeat(depth);
}

// Функция для проверки и добавления недостающих PWA элементов
function updateHtmlFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        let updatedContent = content;
        let hasChanges = false;
        
        const rootPath = getRelativePathToRoot(filePath);
        
        // Проверяем наличие manifest.json
        if (!content.includes('rel="manifest"')) {
            console.log(`❌ Отсутствует manifest в: ${filePath}`);
            
            // Ищем место для вставки (после viewport meta или в head)
            const viewportIndex = content.indexOf('<meta name="viewport"');
            if (viewportIndex !== -1) {
                const nextLineIndex = content.indexOf('\n', viewportIndex);
                if (nextLineIndex !== -1) {
                    const insertPoint = nextLineIndex + 1;
                    const manifestLink = `    <link rel="manifest" href="${rootPath}manifest.json">\n`;
                    updatedContent = updatedContent.slice(0, insertPoint) + manifestLink + updatedContent.slice(insertPoint);
                    hasChanges = true;
                    console.log(`✅ Добавлен manifest: ${manifestLink.trim()}`);
                }
            }
        }
        
        // Проверяем наличие apple-mobile-web-app-capable
        if (!content.includes('apple-mobile-web-app-capable')) {
            console.log(`❌ Отсутствует apple-mobile-web-app-capable в: ${filePath}`);
            
            // Ищем место для вставки после theme-color
            const themeColorIndex = content.indexOf('<meta name="theme-color"');
            if (themeColorIndex !== -1) {
                const nextLineIndex = updatedContent.indexOf('\n', themeColorIndex);
                if (nextLineIndex !== -1) {
                    const insertPoint = nextLineIndex + 1;
                    const appleMeta = `    <meta name="apple-mobile-web-app-capable" content="yes">\n    <meta name="apple-mobile-web-app-status-bar-style" content="default">\n`;
                    updatedContent = updatedContent.slice(0, insertPoint) + appleMeta + updatedContent.slice(insertPoint);
                    hasChanges = true;
                    console.log(`✅ Добавлены Apple meta теги`);
                }
            }
        }
        
        // Сохраняем файл если были изменения
        if (hasChanges) {
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            console.log(`✅ Обновлен файл: ${filePath}\n`);
        } else {
            console.log(`✅ Файл уже содержит все необходимые PWA элементы: ${filePath}\n`);
        }
        
    } catch (error) {
        console.error(`❌ Ошибка при обработке файла ${filePath}:`, error.message);
    }
}

// Основная функция
function main() {
    console.log('🚀 Запуск полного обновления PWA для всех HTML файлов...\n');
    
    const websiteDir = __dirname;
    const htmlFiles = findHtmlFiles(websiteDir);
    
    console.log(`📁 Найдено ${htmlFiles.length} HTML файлов:\n`);
    
    htmlFiles.forEach(file => {
        console.log(`🔍 Обрабатываю: ${file}`);
        updateHtmlFile(file);
    });
    
    console.log('✅ Обновление завершено!');
    console.log('\n📋 Рекомендации:');
    console.log('1. Проверьте работу PWA в браузере (F12 → Application → Manifest/Service Workers)');
    console.log('2. Протестируйте установку приложения и офлайн-режим');
    console.log('3. Замените SVG-заглушку на настоящие иконки в manifest.json');
    console.log('4. Проверьте правильность всех путей к PWA-файлам');
}

// Запуск
if (require.main === module) {
    main();
}

module.exports = { findHtmlFiles, updateHtmlFile, getRelativePathToRoot };
