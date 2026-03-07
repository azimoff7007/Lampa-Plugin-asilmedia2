(function() {
    'use strict';

    console.log('🚀 Asilmedia плагин загружается');

    // ========== НАСТРОЙКИ ==========
    var SOURCE_NAME = 'Asilmedia';
    var BASE_URL = 'https://asilmedia.org';

    // ========== КАТЕГОРИИ ==========
    var CATEGORIES = [
        { title: 'Узбекские фильмы', url: '/films/ozbek_kinolar/' },
        { title: 'Переводные фильмы', url: '/films/tarjima_kinolar/' },
        { title: 'Русские фильмы', url: '/films/rusfilm/' },
        { title: 'Сериалы', url: '/films/serial/' },
        { title: 'Мультфильмы', url: '/films/multfilmlar_multiklar/' }
    ];

    // ========== СОЗДАЁМ ПУНКТ МЕНЮ ==========
    function addMenuItem() {
        var menu = document.querySelector('.menu__list');
        if (!menu) {
            setTimeout(addMenuItem, 1000);
            return;
        }

        var item = document.createElement('li');
        item.className = 'menu__item selector';
        item.innerHTML = '<div class="menu__ico"><svg viewBox="0 0 512 512"><path fill="currentColor" d="M482.909,67.2H29.091C13.05,67.2,0,80.25,0,96.291v319.418C0,431.75,13.05,444.8,29.091,444.8h453.818c16.041,0,29.091-13.05,29.091-29.091V96.291C512,80.25,498.95,67.2,482.909,67.2z"/></svg></div><div class="menu__text">Asilmedia</div>';
        
        item.onclick = function() {
            Lampa.Activity.push({
                url: '',
                title: SOURCE_NAME,
                component: 'category',
                source: 'asilmedia',
                page: 1
            });
        };
        
        menu.appendChild(item);
        console.log('✅ Пункт меню добавлен');
    }

    // ========== API ДЛЯ LAMPA ==========
    Lampa.Api.sources.asilmedia = {
        category: function(params, onSuccess) {
            onSuccess(CATEGORIES);
        },
        
        list: function(params, onSuccess, onError) {
            var url = params.url;
            var page = params.page || 1;
            
            Lampa.Network.get(BASE_URL + url + (page > 1 ? 'page/' + page + '/' : ''), function(html) {
                var movies = [];
                var parser = new DOMParser();
                var doc = parser.parseFromString(html, 'text/html');
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
                    
                    movies.push({
                        id: idMatch[1],
                        title: title,
                        poster: poster,
                        media_type: 'movie'
                    });
                });
                
                onSuccess({
                    results: movies,
                    page: page,
                    total_pages: 100
                });
            }, onError);
        }
    };

    // ========== ЗАПУСК ==========
    setTimeout(addMenuItem, 2000);
    console.log('🎬 Плагин готов');
})();
