/**
 * Get cached site preference
 * @param {string} sitePrefId - site preference ID
 * @param {boolean} shouldParse - should the content be parsed
 * @param {boolean} isEnumVariable - is the site preference an enum variable
 * @returns {any} - cached site preference
 */
function getCachedSitePref(sitePrefId, shouldParse, isEnumVariable) {
    var CacheMgr = require('dw/system/CacheMgr');
    var currentSite = require('dw/system/Site').getCurrent();
    var cache = CacheMgr.getCache('SitePreferences');

    return cache.get(currentSite.ID + '--' + sitePrefId, function loadSitePreferencesCache() {
        var sitePrefValue = currentSite.getCustomPreferenceValue(sitePrefId);

        if (isEnumVariable) {
            sitePrefValue = sitePrefValue.value;
        }

        if (shouldParse) {
            var jsonParse = require('*/cartridge/scripts/util/json').parse;
            return jsonParse(sitePrefValue);
        }

        return sitePrefValue;
    });
}

module.exports = {
    getCachedSitePref: getCachedSitePref
};
