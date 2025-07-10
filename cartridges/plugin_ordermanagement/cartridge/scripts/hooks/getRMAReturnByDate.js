'use strict';

/**
 * Returns the return by date for RMAs based on current date and
 * duration site preference.
 *
 * @returns {Date} The return by date
 */
function execute() {
    var somPreferences = require('*/cartridge/config/somPreferences');

    var rmaReturnByDate = new Date();
    rmaReturnByDate.setDate(rmaReturnByDate.getDate() + somPreferences.returnOrderReturnByDateNumberOfDays);

    return rmaReturnByDate;
}

module.exports = {
    execute: execute
};
