'use strict';

/**
 * Getting a slot banner category image object processed by the DIS
 *
 * @param {dw.catalog.Category} category - A single category
 * @param {string} viewType - image view type
 * @returns {string} imageDIS path
 */
function getCategorySlotBannerImageDIS(category, viewType) {
    var DISHelpers = require('*/cartridge/scripts/helpers/DISHelpers');
    var objectUtil = require('util/object');

    var DISConfiguration = DISHelpers.getDISConfigurationForType('categoryBanner');
    var slotBannerImage = objectUtil.get(category, 'custom.slotBannerImage');
    var slotBannerImageConfig = DISConfiguration[viewType];
    var slotBannerImageDIS = '';

    var categoryImage = slotBannerImage || category.image;

    if (categoryImage) {
        slotBannerImageDIS = slotBannerImageConfig 
            ? encodeURI(categoryImage.getImageURL(slotBannerImageConfig))
            : encodeURI(categoryImage.getImageURL(null));
    }

    return slotBannerImageDIS;
}

module.exports = {
    getCategorySlotBannerImageDIS: getCategorySlotBannerImageDIS
};

