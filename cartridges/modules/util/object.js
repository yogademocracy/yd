var type = require('./type');

/**
 * @description Object.assign polyfill
 *
 * @param {object} target - target object
 * @returns {object} result
 */
function assign(target) {
    if (type.isNull(target) || type.isUndefined(target)) {
        throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (type.isNull(nextSource) || type.isUndefined(nextSource)) {
            continue;
        }

        // eslint-disable-next-line no-restricted-syntax
        for (var nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey];
            }
        }
    }

    return to;
}

/**
 * @param {object} target - target object
 * @returns {object} result
 */
function deepAssign(target) {
    var sources = Array.prototype.slice.call(arguments, 1);

    return sources.reduce(function (prev, obj) {
        Object.keys(obj).forEach(function (key) {
            var pVal = prev[key];
            var oVal = obj[key];

            if (Array.isArray(pVal) && Array.isArray(oVal)) {
                prev[key] = pVal.concat(oVal);
            } else if (type.isObject(pVal) && type.isObject(oVal)) {
                prev[key] = deepAssign(pVal, oVal);
            } else {
                prev[key] = oVal;
            }
        });

        return prev;
    }, target);
}

/**
 * @description Polyfill for Object.keys
 *
 * @param {object} obj - object
 * @returns {object} result
 */
function keys(obj) {
    return Object.keys(obj);
}

/**
 * @description Polyfill for Object.values
 *
 * @param {object} obj - object to get values from
 * @returns {object} result
 */
function values(obj) {
    return Object.keys(obj).map(function (key) {
        return obj[key];
    });
}

/**
 * @description Polyfill for Object.entries
 *
 * @param {object} obj - object from get entries
 * @returns {object} result
 */
function entries(obj) {
    var ownProps = Object.keys(obj);
    var i = ownProps.length;
    var resArray = new Array(i);

    while (i--) {
        resArray[i] = [ownProps[i], obj[ownProps[i]]];
    }

    return resArray;
}

/**
 * @param {object} obj - object to convert to hash map
 * @returns {dw.util.HashMap} result
 */
function toHashMap(obj) {
    var HashMap = require('dw/util/HashMap');
    var result = new HashMap();

    Object.keys(obj).forEach(function (key) {
        result.put(key, obj[key]);
    });

    return result;
}

/**
 * @description Converts hashMap to object
 * @param {dw.util.HashMap} obj - entry hash map
 * @returns {object} result
 */
function fromHashMap(obj) {
    var result = {};
    var entryIterator = obj.entrySet().iterator();

    while (entryIterator.hasNext()) {
        var entry = entryIterator.next();
        var key = entry[0];
        var value = entry[1];

        result[key] = value;
    }

    return result;
}

/**
 * @description Access given properties of an object recursively
 *
 * @param {object} obj The object
 * @param {string} path The property string, i.e. 'data.myValue.prop1'
 * @returns {object} The value of the given property or undefined
 */
function get(obj, path) {
    var propPath = (path || '').split('.');
    var result = obj;

    propPath.forEach(function (prop) {
        if (result && prop in result) {
            result = result[prop];
        } else {
            result = undefined;
        }
    });

    return result;
}

/**
 * @description If given property path exists sets a given value
 *
 * @param {object} obj - object to set value
 * @param {string} path - path for the value
 * @param {*} value - value to set
 * @returns {boolean} true if value has been changed, otherwise - false
 */
function setPropertyIfPathExists(obj, path, value) {
    var propPath = (path || '').split('.');
    var nested = obj;
    var lastIndex = propPath.length - 1;

    for (var i = 0; i < propPath.length; i++) {
        var prop = propPath[i];

        if (!type.isBoolean(nested[prop]) && !nested[prop]) {
            return false;
        }

        if (i !== lastIndex) {
            nested = nested[prop];
        } else {
            nested[prop] = value;
        }
    }

    return true;
}

/**
 * @description Sets the value at path of object.
 * If a portion of path doesn't exist, it's created.
 *
 * @param {object} obj - object to set value
 * @param {string} path - path for the value
 * @param {*} value - value to set
 * @returns {object} result
 */
function set(obj, path, value) {
    var propPath = (path || '').split('.');
    var nested = obj;
    var lastIndex = propPath.length - 1;

    propPath.forEach(function (prop, i) {
        if (!type.isBoolean(nested[prop]) && !nested[prop] && i !== lastIndex) {
            nested[prop] = {};
        }

        if (i !== lastIndex) {
            nested = nested[prop];
        } else {
            nested[prop] = value;
        }
    });

    return obj;
}

/**
 * @description Modifies target object to remove nested key
 * @param {object|undefined} obj target object
 * @param {string|undefined} path a path for key to remove
 * @returns {object|undefined} modified object with nested key removed
 */
function deleteKey(obj, path) {
    var propPath = (path || '').split('.');
    var nested = obj;
    var lastIndex = propPath.length - 1;

    propPath.forEach(function (prop, i) {
        if (!nested[prop]) {
            return;
        }

        if (i !== lastIndex) {
            nested = nested[prop];
        } else {
            delete nested[prop];
        }
    });

    return obj;
}

/**
 * @description Checks that current object is empty
 * @param {object} obj - target object
 * @returns {boolean} result
 */
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

module.exports = {
    assign: assign,
    deepAssign: deepAssign,
    keys: keys,
    values: values,
    entries: entries,
    toHashMap: toHashMap,
    fromHashMap: fromHashMap,
    get: get,
    set: set,
    deleteKey: deleteKey,
    isEmpty: isEmpty,
    setPropertyIfPathExists: setPropertyIfPathExists
};
