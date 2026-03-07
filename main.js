(function() {
    'use strict';

    console.log('🚀 ТЕСТОВЫЙ ПЛАГИН');

    // Просто добавляем пункт в меню
    Lampa.Source.add('Тест Asilmedia', {
        title: 'Тест Asilmedia',
        source: 'test',
        component: 'category'
    });

    console.log('✅ Пункт меню добавлен');
})();
