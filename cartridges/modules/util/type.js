'use strict';

/**
 * @param {any} obj - object
 * @returns {string} result
 */
function getType(obj) {
    return Object.prototype.toString.call(obj).match(/([a-z]+)(:?\])/i)[1].toLowerCase();
}

/**
 * @param {*} type - any type to check
 * @returns {Function} result
 */
function typeWrapper(type) {
    return function (obj) {
        return getType(obj) === type;
    };
}

module.exports = {
    getType: getType,
    isNull: typeWrapper('null'),
    isUndefined: typeWrapper('undefined'),
    isString: typeWrapper('string'),
    isNumber: typeWrapper('number'),
    isBoolean: typeWrapper('boolean'),
    isObject: typeWrapper('object'),
    isArray: Array.isArray
};
