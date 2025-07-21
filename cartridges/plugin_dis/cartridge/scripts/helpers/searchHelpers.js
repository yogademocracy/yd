'use strict';

var base = module.superModule;

/**
 * Retrieves banner image URL
 *
 * @param {dw.catalog.Category} category - Subject category
 * @return {string} - Banner's image URL
 */
base.getBannerImageUrl = function (category) {
    var DISHelpers = require('*/cartridge/scripts/helpers/DISHelpers');

    var DISImageURL = DISHelpers.getCategorySlotBannerImageDIS(category, 'large');

    return DISImageURL;
};

module.exports = base;
