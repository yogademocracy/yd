'use strict';

/**
 * Gets recommendations for given product Id
 *
 * @param {string} pid - product ID
 * @returns {Array<Object>} Array of recommendation objects
 */
function getRecommendationsForProduct(pid) {
    var ProductMgr = require('dw/catalog/ProductMgr');

    var collections = require('*/cartridge/scripts/util/collections');

    var recommendations = [];
    var product = ProductMgr.getProduct(pid);

    if (!product || empty(product.recommendations)) {
        return recommendations;
    }

    collections.forEach(product.recommendations, (recommendation) => {
        recommendations.push(recommendation.recommendedItem);
    });

    return recommendations;
};

/**
 * Returns configuration settings for the recommendations slider.
 *
 * @returns {string} JSON string of slider settings
 */
function getRecommendationsSliderSettings() {
    var settings = {
        loop: true,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
        },
        spaceBetween: 20,
        slidesPerView: 2,
        breakpoints: {
            769: {
                slidesPerView: 4
            }
        }
    };

    return JSON.stringify(settings);
}

module.exports = {
    getRecommendationsForProduct: getRecommendationsForProduct,
    getRecommendationsSliderSettings: getRecommendationsSliderSettings
};
