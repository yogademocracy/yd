'use strict';

var baseHelper = module.superModule;

var URLUtils = require('dw/web/URLUtils');

/**
 * Gets the password reset token of a customer
 * @param {Object} customer - the customer requesting password reset token
 * @returns {string} password reset token string
 */
function getPasswordResetToken(customer) {
    var Transaction = require('dw/system/Transaction');

    var passwordResetToken;
    Transaction.wrap(function () {
        passwordResetToken = customer.profile.credentials.createResetPasswordToken();
    });
    return passwordResetToken;
}

/**
 * Send an email that would notify the user that account was created
 * @param {obj} registeredUser - object that contains user's email address and name information.
 */
baseHelper.sendCreateAccountEmail = function (registeredUser) {
    var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');
    var contentHelpers = require('*/cartridge/scripts/helpers/contentHelpers');
    var Site = require('dw/system/Site');
    var Resource = require('dw/web/Resource');

    var userObject = {
        firstName: registeredUser.firstName,
        lastName: registeredUser.lastName
    };

    var params = {
        message: contentHelpers.getContentById('account-registered-email', userObject),
    };

    var emailObj = {
        to: registeredUser.email,
        subject: Resource.msg('email.subject.new.registration', 'registration', null),
        from: Site.current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@testorganization.com',
        type: emailHelpers.emailTypes.registration
    };

    emailHelpers.sendEmail(emailObj, 'email/assetContentEmail', params);
};

/**
 * Sends the email with password reset instructions
 * @param {string} email - email for password reset
 * @param {Object} resettingCustomer - the customer requesting password reset
 */
baseHelper.sendPasswordResetEmail = function (email, resettingCustomer) {
    var Resource = require('dw/web/Resource');
    var Site = require('dw/system/Site');
    var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');
    var contentHelpers = require('*/cartridge/scripts/helpers/contentHelpers');

    var passwordResetToken = getPasswordResetToken(resettingCustomer);
    var url = URLUtils.https('Account-SetNewPassword', 'Token', passwordResetToken);
    var objectForEmail = {
        passwordResetToken: passwordResetToken,
        resetUrl: url,
        resetBtnUrl: url
    };

    var params = {
        message: contentHelpers.getContentById('password-reset-email', objectForEmail),
    };

    var emailObj = {
        to: email,
        subject: Resource.msg('subject.profile.resetpassword.email', 'login', null),
        from: Site.current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@testorganization.com',
        type: emailHelpers.emailTypes.passwordChanged
    };

    emailHelpers.sendEmail(emailObj, 'email/assetContentEmail', params);
};

module.exports = baseHelper;
