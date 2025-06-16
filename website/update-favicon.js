const fs = require('fs');
const path = require('path');

function updateFaviconInFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let updated = false;

        // Обновляем favicon.ico на PNG
        if (content.includes('images/favicon.ico')) {
            content = content.replace(
                /href="[^"]*images\/favicon\.ico"/g,
                'href="../../images/logo/192.png"'
            );
            content = content.replace(
                /type="image\/x-icon"/g,
                'type="image/png"'
            );
            updated = true;
        }

        // Обновляем apple-touch-icon.png
        if (content.includes('apple-touch-icon.png')) {
            content = content.replace(
                /href="[^"]*apple-touch-icon\.png"/g,
                'href="../../images/logo/192.png"'
            );
            updated = true;
        }

        // Исправляем пути для файлов в корне
        if (filePath.includes('index.html') && !filePath.includes('pages')) {
            content = content.replace(
                /href="\.\.\/\.\.\/images\/logo\/192\.png"/g,
                'href="images/logo/192.png"'
            );
        }

        if (updated) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Обновлен favicon в: ${filePath}`);
        }
    } catch (error) {
        console.error(`❌ Ошибка при обновлении ${filePath}:`, error.message);
    }
}

function scanDirectory(dirPath, depth = 0) {
    const MAX_DEPTH = 10;
    if (depth > MAX_DEPTH) return;

    try {
        const items = fs.readdirSync(dirPath);
        
        for (const item of items) {
            const fullPath = path.join(dirPath, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                scanDirectory(fullPath, depth + 1);
            } else if (item.endsWith('.html') && 
                      !item.includes('offline') && 
                      !item.includes('header') && 
                      !item.includes('footer') && 
                      !item.includes('search')) {
                updateFaviconInFile(fullPath);
            }
        }
    } catch (error) {
        console.error(`❌ Ошибка при сканировании ${dirPath}:`, error.message);
    }
}

console.log('🔧 Начинаем обновление favicon во всех HTML-файлах...\n');

// Сканируем все HTML-файлы
scanDirectory('./');

console.log('\n✅ Обновление favicon завершено!');
