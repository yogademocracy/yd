'use strict';

var base = require('base/search/search');

/**
 * Update DOM elements with Ajax results
 *
 * @param {Object} $results - jQuery DOM element
 * @param {string} selector - DOM element to look up in the $results
 * @return {undefined}
 */
function updateDom($results, selector) {
    var $updates = $results.find(selector);
    $(selector).empty().html($updates.html());
    $('body').trigger('search:updateDom', selector);
}

/**
 * Keep refinement panes expanded/collapsed after Ajax refresh
 *
 * @param {Object} $results - jQuery DOM element
 * @return {undefined}
 */
function handleRefinements($results) {
    $('.refinement.active').each(function () {
        $(this).removeClass('active');
        var activeDiv = $results.find('.' + $(this)[0].className.replace(/ /g, '.'));
        activeDiv.addClass('active');
        activeDiv.find('button.title').attr('aria-expanded', 'true');
    });

    updateDom($results, '.refinements');
}

/**
 * Parse Ajax results and updated select DOM elements
 *
 * @param {string} response - Ajax response HTML code
 * @return {undefined}
 */
function parseResults(response) {
    var $results = $(response);
    var specialHandlers = {
        '.refinements': handleRefinements
    };

    // Update DOM elements that do not require special handling
    [
        '.grid-header',
        '.header-bar',
        '.header.page-title',
        '.product-grid',
        '.show-more',
        '.filter-bar',
        '.js-sort-select'
    ].forEach(function (selector) {
        updateDom($results, selector);
    });

    Object.keys(specialHandlers).forEach(function (selector) {
        specialHandlers[selector]($results);
    });
}

base.applyPriceFilter = function () {
    // Handle refinement value selection and reset click
    $('.container').on(
        'click',
        '.refinements li button, .refinement-bar button.reset, .filter-value button, .swatch-filter button',
        function (e) {
            e.preventDefault();
            e.stopPropagation();

            $.spinner().start();
            $(this).trigger('search:filter', e);

            var searchUrl = $(this).data('href');
            var seoUrl = $(this).data('seo-href') || searchUrl;
            if (seoUrl) {
                window.history.pushState({}, null, seoUrl);
            }

            var attributeId = '#' + $(this).find('span').last().attr('id');
            $.ajax({
                url: searchUrl,
                data: {
                    page: $('.grid-footer').data('page-number'),
                    selectedUrl: searchUrl
                },
                method: 'GET',
                success: function (response) {
                    parseResults(response);
                    $.spinner().stop();
                    $(attributeId).parent('button').focus();
                },
                error: function () {
                    $.spinner().stop();
                    $(attributeId).parent('button').focus();
                }
            });
        }
    );
};

module.exports = base;
