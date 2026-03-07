(function() {
    'use strict';

    // ========== НАСТРОЙКИ ==========
    var SOURCE_NAME = 'Asilmedia';
    var BASE_URL = 'https://asilmedia.org';

    // ========== КАТЕГОРИИ ==========
    var CATEGORIES = [
        { title: 'Узбекские фильмы', url: '/films/ozbek_kinolar/' },
        { title: 'Переводные фильмы', url: '/films/tarjima_kinolar/' },
        { title: 'Русские фильмы', url: '/films/rusfilm/' },
        { title: 'Сериалы', url: '/films/serial/' },
        { title: 'Мультфильмы', url: '/films/multfilmlar_multiklar/' },
        { title: 'Фильмы 2026', url: '/xfsearch/year/2026/' },
        { title: 'Фильмы 2025', url: '/xfsearch/year/2025/' },
        { title: 'Фильмы 2024', url: '/xfsearch/year/2024/' }
    ];

    // ========== ОСНОВНОЙ КЛАСС ==========
    function AsilmediaAPI() {
        var self = this;
        
        // Получение категорий
        self.category = function(params, onSuccess) {
            onSuccess(CATEGORIES);
        };
        
        // Получение списка фильмов
        self.list = function(params, onSuccess, onError) {
            var url = params.url;
            var page = params.page || 1;
            
            Lampa.Network.get(BASE_URL + url + (page > 1 ? 'page/' + page + '/' : ''), function(html) {
                var movies = [];
                
                // Разбираем HTML
                var parser = new DOMParser();
                var doc = parser.parseFromString(html, 'text/html');
                
                // Ищем все блоки с фильмами
                var items = doc.querySelectorAll('article.moviebox');
                
                items.forEach(function(item) {
                    var link = item.querySelector('a[href*=".html"]');
                    if (!link) return;
                    
                    var href = link.getAttribute('href');
                    var idMatch = href.match(/\/(\d+)-/);
                    if (!idMatch) return;
                    
                    var titleEl = item.querySelector('.title.is-6');
                    var title = titleEl ? titleEl.textContent.trim() : 'Без названия';
                    
                    var img = item.querySelector('img.lazyload');
                    var poster = img ? img.getAttribute('data-src') : '';
                    
                    var yearEl = item.querySelector('.year a');
                    var year = yearEl ? yearEl.textContent : '';
                    
                    // Добавляем фильм
                    movies.push({
                        id: idMatch[1],
                        title: title,
                        year: year,
                        poster: poster,
                        media_type: 'movie',
                        source: SOURCE_NAME
                    });
                });
                
                // Возвращаем результат
                onSuccess({
                    results: movies,
                    page: page,
                    total_pages: 100
                });
            }, onError);
        };
    }

    // ========== РЕГИСТРАЦИЯ ==========
    Lampa.Api.sources.asilmedia = new AsilmediaAPI();

    // ========== ДОБАВЛЕНИЕ В МЕНЮ ==========
    Lampa.Source.add(SOURCE_NAME, {
        title: SOURCE_NAME,
        source: 'asilmedia',
        component: 'category',
        page: 1
    });

    console.log('✅ Плагин Asilmedia загружен');
})();