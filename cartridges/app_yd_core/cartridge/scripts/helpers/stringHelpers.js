'use strict';

/**
 * Checks and removes unmatched quotes
 * @param {string} string - string to be checked
 * @returns {string} string without unmatched quotes
 */
function removeUnmatchedQuotes(string) {
    var transformedStr = string;

    var doubleQuoteCount = (transformedStr.match(/"/g) || []).length;
    var singleQuoteCount = (transformedStr.match(/'/g) || []).length;

    if (doubleQuoteCount % 2 !== 0) {
        transformedStr = transformedStr.replace(/"/g, '');
    }

    if (singleQuoteCount % 2 !== 0) {
        transformedStr = transformedStr.replace(/'/g, '');
    }

    return transformedStr;
}

module.exports = {
    removeUnmatchedQuotes: removeUnmatchedQuotes
};
