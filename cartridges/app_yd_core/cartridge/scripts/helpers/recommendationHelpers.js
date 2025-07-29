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

module.exports = {
    getRecommendationsForProduct: getRecommendationsForProduct
};
