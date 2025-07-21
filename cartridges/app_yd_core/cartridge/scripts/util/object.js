'use strict';

/**
 * @module object
 */

/**
 * Deep copies all all object properties from source to target
 *
 * @param {Object} targetObject The target object which should be extended
 * @param {...Object} sourceObject The objects for extension
 * @return {Object} The target object which should be extended
 */
function extend(targetObject, sourceObject) {
    var target = targetObject;
    var source;

    if (!target) {
        return sourceObject;
    }

    for (var i = 1; i < arguments.length; i++) {
        source = arguments[i];

        for (var prop in source) {
            // recurse for non-API objects
            if (source[prop] && typeof source[prop] === 'object' && !source[prop].class) {
                target[prop] = this.extend(target[prop], source[prop]);
            } else {
                target[prop] = source[prop];
            }
        }
    }

    return target;
}

/**
 * Access given properties of an object recursively
 *
 * @param {Object} object The object
 * @param {string} propertyString The property string, i.e. 'data.myValue.prop1'
 * @return {Object} The value of the given property or undefined
 * @example
 * var prop1 = require('~/object').resolve(obj, 'data.myValue.prop1')
 */
function resolve(object, propertyString) {
    var result = object;
    var propPath = propertyString.split('.');

    propPath.forEach(function (prop) {
        if (result && Object.hasOwnProperty.call(result, prop)) {
            result = result[prop];
        } else {
            result = undefined;
        }
    });

    return result;
}

/**
 * Returns an array containing all object values
 *
 * @param {Object} object - object
 * @return {Array} array
 */
function values(object) {
    return !object
        ? []
        : Object.keys(object).map(function (key) {
            return object[key];
        });
}

/**
 * A shortcut for native static method "keys" of "Object" class
 *
 * @param {Object} object - object
 * @return {Array} array
 */
function keys(object) {
    return object ? Object.keys(object) : [];
}

/**
 * Convert the given object to a HashMap object
 *
 * @param {Object} object - object
 * @return {dw.util.HashMap} all the data which will be used in mail template.
 */
function toHashMap(object) {
    var HashMap = require('dw/util/HashMap');
    var hashmap = new HashMap();

    for (var key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
            hashmap.put(key, object[key]);
        }
    }

    return hashmap;
}

/**
 * Convert the given Map to a plain object
 *
 * @param {dw.util.Map} map - HashMap
 * @return {Object} all the data which will be used in mail template.
 */
function fromHashMap(map) {
    var object = {};
    var entrySet = map.entrySet();

    for (var entry in entrySet) {
        object[entry.key] = entry.value;
    }

    return object;
}

/**
 * @function
 * @description set value in object by path
 * @param {Object} object where to set data
 * @param {string} path to an object attribute
 * @param {Object|string|Array|boolean} value to set
 * @return {boolean} if well set
 */
function setPropertyByPath(object, path, value) {
    if (!object || !path) {
        return false;
    }
    var key = object;

    var pathArray = path.split('.');
    var lastKey = pathArray.pop();

    pathArray.forEach(function (prop) {
        if (!Object.hasOwnProperty.call(key, prop)) {
            key[prop] = {};
        }
        key = key[prop];
    });
    key[lastKey] = value;

    return true;
}

/**
 * @function
 * @description gets value from object by path
 * @param {Object} object with needed data
 * @param {string} path to needed property joined by dot
 * @param {Object=} errorResult will be return then error, or null
 * @return {Object|string|Array|boolean} value for searched property
 */
function getPropertyByPath(object, path, errorResult) {
    if (!path || !object) {
        return errorResult !== undefined ? errorResult : null;
    }

    var key = object;
    var splittedPath = path.split('.');

    for (var i in splittedPath) {
        if (key && Object.hasOwnProperty.call(key, splittedPath[i])) {
            key = key[splittedPath[i]];
        } else {
            key = errorResult !== undefined ? errorResult : null;
        }
    }
    return key;
}

/**
 * @function
 * @description Checks that current object is empty
 * @param {Object} obj - target object
 * @returns {boolean} result
 */
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}
/**
 * Returns localized value for the searched property
 * @param {Object} object with needed data
 * @param {string} propertyPath to needed property joined by dot
 * @param {Object} defaultValue will be return then error
 * @return {Object|string|Array|boolean} localized value for searched property
 */
function getLocalizedValue(object, propertyPath, defaultValue) {
    if (!propertyPath || !object) {
        return defaultValue;
    }

    var currentLocaleID = request.getLocale();

    return getPropertyByPath(object, [currentLocaleID].concat(propertyPath).join('.'), defaultValue);
}

/**
 * Fetches object definition from Custom Object, creating it if not exists
 * @param {string} customObjectName - custom object name
 * @param {string} objectID - custom object id
 * @param {boolean} [createIfNotExists] - if true, creates and object if it does not exists
 * @return {dw.object.CustomAttributes} - custom attributes
 */
function getCustomObject(customObjectName, objectID, createIfNotExists) {
    var CustomObjectMgr = require('dw/object/CustomObjectMgr');
    var Transaction = require('dw/system/Transaction');

    var objectDefinition = CustomObjectMgr.getCustomObject(customObjectName, objectID);

    if (empty(objectDefinition) && createIfNotExists === true) {
        Transaction.wrap(function () {
            objectDefinition = CustomObjectMgr.createCustomObject(customObjectName, objectID);
        });
    }

    return !empty(objectDefinition) && objectDefinition.getCustom();
}

module.exports = {
    extend: extend,
    resolve: resolve,
    values: values,
    keys: keys,
    toHashMap: toHashMap,
    fromHashMap: fromHashMap,
    setPropertyByPath: setPropertyByPath,
    getPropertyByPath: getPropertyByPath,
    isEmpty: isEmpty,
    getLocalizedValue: getLocalizedValue,
    getCustomObject: getCustomObject
};
