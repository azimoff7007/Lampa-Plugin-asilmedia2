(function () {
    'use strict';

    var SOURCE_NAME = 'Asilmedia';
    var BASE_URL = 'https://asilmedia.org';
    
    var ICON = '<svg viewBox="0 0 512 512"><path fill="currentColor" d="M482.909,67.2H29.091C13.05,67.2,0,80.25,0,96.291v319.418C0,431.75,13.05,444.8,29.091,444.8h453.818c16.041,0,29.091-13.05,29.091-29.091V96.291C512,80.25,498.95,67.2,482.909,67.2z"/></svg>';

    // Категории из меню сайта (ты их показывал)
    var CATEGORIES = {
        uzbek_films: { title: 'Узбекские фильмы', url: '/films/ozbek_kinolar/' },
        tarjima_films: { title: 'Переводные фильмы', url: '/films/tarjima_kinolar/' },
        foreign_films: { title: 'Зарубежные фильмы', url: '/films/zarfilm/' },
        russian_films: { title: 'Русские фильмы', url: '/films/rusfilm/' },
        series: { title: 'Сериалы', url: '/films/serial/' },
        cartoons: { title: 'Мультфильмы', url: '/films/multfilmlar_multiklar/' },
        year_2026: { title: 'Фильмы 2026', url: '/xfsearch/year/2026/' }
    };

    function AsilmediaApi() {
        var self = this;
        self.network = new Lampa.Reguest();

        // Функция для списка фильмов
        self.category = function(params, onSuccess, onError) {
            var parts = [];
            
            for (var key in CATEGORIES) {
                (function(url, title) {
                    parts.push(function(callback) {
                        callback({ url: url, title: title, source: 'asilmedia' });
                    });
                })(CATEGORIES[key].url, CATEGORIES[key].title);
            }

            function load(partLoaded, partEmpty) {
                Lampa.Api.partNext(parts, 5, partLoaded, partEmpty);
            }
            load(onSuccess, onError);
            return load;
        };
    }

    // Добавляем в меню Lampa
    function start() {
        var api = new AsilmediaApi();
        Lampa.Api.sources.asilmedia = api;

        var menuItem = $('<li class="menu__item selector"><div class="menu__ico">' + ICON + '</div><div class="menu__text">Asilmedia</div></li>');
        
        function addToMenu() {
            var menu = $('.menu .menu__list').eq(0);
            if (menu.length) {
                menu.append(menuItem);
            } else {
                setTimeout(addToMenu, 100);
            }
        }
        addToMenu();

        menuItem.on('hover:enter', function() {
            Lampa.Activity.push({
                title: 'Asilmedia',
                component: 'category',
                source: 'asilmedia',
                page: 1
            });
        });
    }

    if (window.appready) {
        start();
    } else {
        Lampa.Listener.follow('app', function(e) {
            if (e.type === 'ready') start();
        });
    }
})();