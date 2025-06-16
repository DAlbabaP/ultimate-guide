// Скрипт для тестирования исправлений PWA
// Запустите в консоли браузера: await testPWAFix()

async function testPWAFix() {
  console.log('🧪 Тестирование исправлений PWA...');
  
  try {
    // 1. Сначала полная очистка
    console.log('\n1️⃣ Полная очистка PWA...');
    await resetPWA();
    
    // 2. Пауза для очистки
    console.log('\n⏱️ Ожидание 2 секунды для завершения очистки...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 3. Перезагрузка страницы
    console.log('\n🔄 Перезагрузка страницы...');
    console.log('📋 После перезагрузки выполните: await checkAfterReload()');
    
    // Сохраняем инструкцию в localStorage для показа после перезагрузки
    localStorage.setItem('pwa-test-instruction', 'После перезагрузки выполните: await checkAfterReload()');
    
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error);
  }
}

// Функция для проверки после перезагрузки
async function checkAfterReload() {
  console.log('🔍 Проверка состояния после перезагрузки...');
  
  // Показываем сохраненную инструкцию и очищаем
  const instruction = localStorage.getItem('pwa-test-instruction');
  if (instruction) {
    console.log('📋', instruction);
    localStorage.removeItem('pwa-test-instruction');
  }
  
  // Ждем инициализации PWA
  console.log('⏱️ Ожидание инициализации PWA (3 сек)...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Диагностика
  if (typeof PWA !== 'undefined' && PWA.diagnose) {
    const result = await PWA.diagnose();
    
    // Анализ результатов
    console.log('\n📊 АНАЛИЗ РЕЗУЛЬТАТОВ:');
    
    if (result.serviceWorker.active) {
      console.log('✅ SW активен и работает');
    } else {
      console.log('❌ SW не активен');
      if (typeof forceActivateSW !== 'undefined') {
        console.log('🔧 Попытка принудительной активации...');
        const activated = await forceActivateSW();
        if (activated) {
          console.log('✅ SW активирован принудительно');
          // Повторная диагностика после активации
          console.log('\n🔄 Повторная диагностика после активации...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          const newResult = await PWA.diagnose();
          if (newResult.serviceWorker.active) {
            console.log('✅ SW теперь активен!');
          }
        } else {
          console.log('❌ Не удалось активировать SW');
          console.log('💡 Попробуйте:');
          console.log('   1. await resetPWA() - полная очистка');
          console.log('   2. Обновить страницу (F5)');
          console.log('   3. Попробовать снова');
        }
      }
    }
    
    if (result.caches.length <= 3 && result.caches.every(cache => cache.includes('v1.3.0'))) {
      console.log('✅ Кэши корректны (только v1.3.0)');
    } else {
      console.log('⚠️ Проблемы с кэшами:', result.caches);
      if (result.caches.length > 3) {
        console.log('💡 Рекомендация: await resetPWA() для очистки лишних кэшей');
      }
    }
    
    if (result.platform.isIOS || result.platform.isAndroid) {
      if (result.installPrompt.bannerVisible) {
        console.log('✅ Баннер установки показан на мобильном');
      } else {
        console.log('⚠️ Баннер установки не показан на мобильном');
        console.log('💡 На мобильных баннер должен появиться через несколько секунд');
      }
    } else {
      console.log('ℹ️ Десктопная платформа - баннер установки работает через beforeinstallprompt');
    }
    
    return result;
  } else {
    console.log('⚠️ PWA модуль еще не инициализирован');
    console.log('🔄 Попробуйте еще раз через несколько секунд');
  }
}

// Функция для быстрой проверки без перезагрузки
async function quickCheck() {
  console.log('⚡ Быстрая проверка PWA...');
  
  if (typeof PWA !== 'undefined' && PWA.diagnose) {
    return await PWA.diagnose();
  } else {
    console.log('⚠️ PWA модуль не доступен');
  }
}

console.log('🚀 Скрипт тестирования PWA загружен!');
console.log('');
console.log('📋 Доступные команды:');
console.log('- await testPWAFix() - полная очистка и перезагрузка');
console.log('- await checkAfterReload() - проверка после перезагрузки');
console.log('- await quickCheck() - быстрая диагностика');
console.log('- await resetPWA() - только очистка (без перезагрузки)');
console.log('- await forceActivateSW() - принудительная активация SW');

// Показываем инструкцию если была перезагрузка
const instruction = localStorage.getItem('pwa-test-instruction');
if (instruction) {
  console.log('');
  console.log('🔔 ' + instruction);
}
