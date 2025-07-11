'use strict';

var baseSearch = require('base/components/search');

module.exports = {
    baseSearch: baseSearch,
    initEvents: function () {
        $('.js-search-toggler').on('click', function () {
            $('.js-site-search').toggleClass('d-none');
        });
    }
};
