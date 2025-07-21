'use strict';

var sitePrefUtil = require('util/sitepref');

var disConfig = null;
var disLibraryConfig = null;
var disDevices = ['desktop', 'mobile', 'tablet'];

/**
 * Get DIS configuration preference
 * @returns {Object} disConfig
 */
function getDISConfiguration() {
    if (disConfig === null) {
        disConfig = sitePrefUtil.getJSONValue('disConfiguration') || require('*/cartridge/preferences/image_config_DIS');
    }

    return disConfig;
}

/**
 * Get configuration for page designer components
 * @returns {Object} json configuration object.
 */
function getDISPageDesignerImageConfig() {
    if (disLibraryConfig === null) {
        disLibraryConfig = sitePrefUtil.getJSONValue('disLibraryConfiguration') || require('*/cartridge/preferences/image_config_library_DIS');
    }

    return disLibraryConfig;
}

/**
 * Get DIS image configuration object for a given field id.
 * @param {string} fieldID id of image field.
 * @returns {Object} configuration object for field or default configuration object.
 */
function getPDConfigByFieldID(fieldID) {
    var config = getDISPageDesignerImageConfig();
    return config[fieldID] || config.defaultConfig;
}

/**
 * Get DIS configuration preference
 * @param {string} type - type of configuration ('Product', 'Category)
 * @returns {Object} disConfig
 */
function getDISConfigurationForType(type) {
    var DISConfiguration = getDISConfiguration();

    if (!DISConfiguration) {
        return {};
    }

    if (type === 'categoryBanner') {
        return DISConfiguration.categoryBanner || {};
    } else {
        return DISConfiguration.product || {};
    }
}

/**
 * Getting a slot banner category image object processed by the DIS
 *
 * @param {dw.catalog.Category} category - A single category
 * @param {string} viewType - image view type
 * @returns {string} imageDIS path
 */
function getCategorySlotBannerImageDIS(category, viewType) {
    var objectUtil = require('util/object');

    var DISConfiguration = getDISConfigurationForType('categoryBanner');
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

/**
 * Get scaled image object with urls.
 * @param {string} fieldID PD component field id
 * @param {Image} image the image for which to be scaled.
 * @returns {Object} image object with urls
 */
function getScaledImageFromPageDesigner(fieldID, image) {
    if (empty(image) || !image.file) {
        return null;
    }

    var devicesConfig = getPDConfigByFieldID(fieldID);

    var result = {
        src: encodeURI(image.file.getHttpsURL().toString()),
        srcset: {},
        alt: image.file.getAlt()
    };

    if ('focalPoint' in image) {
        result.focalPointX = (image.focalPoint.x * 100) + '%';
        result.focalPointY = (image.focalPoint.y * 100) + '%';
    }

    if (devicesConfig) {
        Object.keys(devicesConfig).forEach(function (deviceType) {
            var transformationObj = devicesConfig[deviceType];
            var imageUrl = encodeURI(image.file.getImageURL(transformationObj).toString());

            result.srcset[deviceType] = imageUrl;
        });
    }

    disDevices.forEach((disDevice) => {
        if (!result.srcset[disDevice]) {
            var imageUrl = encodeURI(image.file.getImageURL(null).toString());

            result.srcset[disDevice] = imageUrl;
        }
    });

    return result;
}

module.exports = {
    getDISConfiguration: getDISConfiguration,
    getDISConfigurationForType: getDISConfigurationForType,
    getCategorySlotBannerImageDIS: getCategorySlotBannerImageDIS,
    getScaledImageFromPageDesigner: getScaledImageFromPageDesigner
};
