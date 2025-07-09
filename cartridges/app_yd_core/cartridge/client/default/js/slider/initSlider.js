import Swiper from 'swiper/bundle';

$('.swiper').each(function () {
    const $swiperEl = $(this);
    const settingsStr = $swiperEl.attr('data-swiper-setting');

    let options = {};
    options = settingsStr ? JSON.parse(settingsStr) : {};

    if (options.pagination?.el) {
        options.pagination.el = $swiperEl.find(options.pagination.el)[0];
    }

    if (options.navigation?.nextEl) {
        options.navigation.nextEl = $swiperEl.find(options.navigation.nextEl)[0];
    }

    if (options.navigation?.prevEl) {
        options.navigation.prevEl = $swiperEl.find(options.navigation.prevEl)[0];
    }

    if (options.scrollbar?.el) {
        options.scrollbar.el = $swiperEl.find(options.scrollbar.el)[0];
    }

    new Swiper($swiperEl[0], options);
});

