'use strict';

var CacheMgr = require('dw/system/CacheMgr');
var Site = require('dw/system/Site');

/**
 * @description Retrieves configuration value by Id form SitePreferences
 * @param {string} prefName The name of the preference to get value
 * @param {any} [defaultValue] default value
 * @returns {string|number|boolean|string[]|Date|EnumValue<string|number>[]|number[]|MarkupText} value
 */
function getValue(prefName, defaultValue) {
   var value = empty(prefName)
       ? null
       : require('dw/system/Site').getCurrent().getCustomPreferenceValue(prefName);

   if (!value && defaultValue) {
       return defaultValue;
   }

   return value;
}

module.exports = {
    getValue: getValue,

    /**
     * @description Checks retrieved preferences with value
     * @param {string} prefName The name of the preference to get value
     * @param {any} prefValue preference value
     * @returns {boolean} result
     */
    isEquals: function (prefName, prefValue) {
        var preferenceValue = this.getValue(prefName);


        if (preferenceValue instanceof require('dw/value/EnumValue')) {
            preferenceValue = preferenceValue.value;
        }

        return preferenceValue === prefValue;
    },

    /**
     * @description Retrieves configuration value by Id form SitePreferences and try to parse it as JSON
     * @param {string} prefName The name of the preference to get value
     * @param {any} [defaultValue] default value
     * @returns {object} value
     */
    getJSONValue: function (prefName, defaultValue) {
        var cache = CacheMgr.getCache('SitePreferences');
        var currentSite = Site.getCurrent();
        var cacheKey = [currentSite.getID(), prefName].join('_');

        return cache.get(cacheKey, function loadSitePreferencesCache() {
            var pref = getValue(prefName);
            var result = null;

            if (!pref) {
                return defaultValue;
            }

            try {
                result = JSON.parse(pref);
            } catch (e) {
                return defaultValue;
            }

            return result;
        });
    }
};
