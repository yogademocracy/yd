'use strict';

var base = module.superModule;

/**
 * Sends an email that would notify the user that the request was received by support
 * 
 * @param {string} email - user's email
 * @returns {void}
 */
base.sendContactUsSubmittedEmail = function (email) {
    var Site = require('dw/system/Site');
    var Resource = require('dw/web/Resource');

    var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');
    var contentHelpers = require('*/cartridge/scripts/helpers/contentHelpers');

    var params = {
        message: contentHelpers.getContentById('contact-us-submitted-email-message'),
    };

    var emailObj = {
        to: email,
        subject: Resource.msg('email.subject.contact.us.submitted', 'contactUs', null),
        from: Site.current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@testorganization.com',
        type: emailHelpers.emailTypes.contactUsSubmitted
    };

    emailHelpers.sendEmail(emailObj, 'contactUs/components/contactUsSubmittedEmail', params);
};

/**
 * Sends an email to support with information provided by user
 * 
 * @param {object} userObj - information provided by user in form
 * @returns {void}
 */
base.sendContactUsSupportEmail = function (userObj) {
    var Site = require('dw/system/Site');
    var Resource = require('dw/web/Resource');

    var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');

    var contactUsEmailReceivers = Site.current.getCustomPreferenceValue('contactUsEmailReceivers');

    if (contactUsEmailReceivers) {
        var emailObj = {
            to: contactUsEmailReceivers,
            subject: Resource.msg('email.subject.contact.us.received', 'contactUs', null),
            from: Site.current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@testorganization.com',
            type: emailHelpers.emailTypes.contactUsSupport
        };

        emailHelpers.sendEmail(emailObj, 'contactUs/components/contactUsSupportEmail', userObj);
    }
};

module.exports = base;
