'use strict';

var sitePrefUtil = require('util/sitepref');

var disConfig = null;

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

module.exports = {
    getDISConfiguration: getDISConfiguration,
    getDISConfigurationForType: getDISConfigurationForType
};
