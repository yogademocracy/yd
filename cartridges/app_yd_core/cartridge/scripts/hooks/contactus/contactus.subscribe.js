'use strict';

/**
 * Triggers email notification on contact us from submit
 *
 * @param {string} firstName - The user`s first name provided in contact us form.
 * @param {string} lastName - The user`s last name provided in contact us form.
 * @param {string} email - The user`s email provided in contact us form.
 * @param {string} topic - Selected topic in contact us form.
 * @param {string} message - The user`s message provided in contact us form.
 * @returns {void}
 */
function subscribe(firstName, lastName, email, topic, message) {
    var accountHelpers = require('*/cartridge/scripts/helpers/accountHelpers');

    accountHelpers.sendContactUsSubmittedEmail(email);

    var userObj = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        topic: topic,
        message: message
    };

    accountHelpers.sendContactUsSupportEmail(userObj);
}

module.exports.subscribe = subscribe;
