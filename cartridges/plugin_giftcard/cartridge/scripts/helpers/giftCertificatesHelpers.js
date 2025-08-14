'use strict';

/**
 * Sends an email with gift code
 * 
 * @param {object} record - attributes object from file
 * @returns {void}
 */
function sendEmail(record) {
    var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');
    var contentHelpers = require('*/cartridge/scripts/helpers/contentHelpers');
    var Site = require('dw/system/Site');
    var Resource = require('dw/web/Resource');

    var params = {
        message: contentHelpers.getContentById('email-gift-certificate-created', record),
    };

    var emailObj = {
        to: record.email,
        subject: Resource.msg('email.subject.gift.card', 'registration', null),
        from: Site.current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@testorganization.com',
        type: emailHelpers.emailTypes.registration
    };

    emailHelpers.sendEmail(emailObj, 'email/assetContentEmail', params);
};

module.exports = {
    sendEmail: sendEmail
};
