'use strict';

var server = require('server');
server.extend(module.superModule);

/**
 * Account-SaveNewPassword : The Account-SaveNewPassword endpoint handles resetting a shoppers password. This is the last step in the forgot password user flow. (This step does not log the shopper in.)
 * @name Base/Account-SaveNewPassword
 * @function
 * @memberof Account
 * @param {middleware} - server.middleware.https
 * @param {httpparameter} - token - SFRA utilizes this token to retrieve the shopper
 * @param {httpparameter} - dwfrm_newPasswords_newpassword - Input field for the shopper's new password
 * @param {httpparameter} - dwfrm_newPasswords_newpasswordconfirm  - Input field to confirm the shopper's new password
 * @param {httpparameter} - save - unutilized param
 * @param {category} - sensitive
 * @param {renders} - isml
 * @param {serverfunction} - post
 */
server.replace('SaveNewPassword', server.middleware.https, function (req, res, next) {
    var Transaction = require('dw/system/Transaction');
    var Resource = require('dw/web/Resource');

    var passwordForm = server.forms.getForm('newPasswords');
    // Token used to be a query parameter, now it's in the body. Support both.
    var token = req.form.token || req.querystring.Token;

    if (passwordForm.newpassword.value !== passwordForm.newpasswordconfirm.value) {
        passwordForm.valid = false;
        passwordForm.newpassword.valid = false;
        passwordForm.newpasswordconfirm.valid = false;
        passwordForm.newpasswordconfirm.error = Resource.msg('error.message.mismatch.newpassword', 'forms', null);
    }

    if (passwordForm.valid) {
        var result = {
            newPassword: passwordForm.newpassword.value,
            newPasswordConfirm: passwordForm.newpasswordconfirm.value,
            token: token,
            passwordForm: passwordForm
        };
        res.setViewData(result);
        this.on('route:BeforeComplete', function (req, res) { // eslint-disable-line no-shadow
            var CustomerMgr = require('dw/customer/CustomerMgr');
            var URLUtils = require('dw/web/URLUtils');
            var Site = require('dw/system/Site');
            var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');
            var contentHelpers = require('*/cartridge/scripts/helpers/contentHelpers');

            var formInfo = res.getViewData();
            var status;
            var resettingCustomer;
            Transaction.wrap(function () {
                resettingCustomer = CustomerMgr.getCustomerByToken(formInfo.token);
                status = resettingCustomer.profile.credentials.setPasswordWithToken(
                    formInfo.token,
                    formInfo.newPassword
                );
            });
            if (status.error) {
                passwordForm.newpassword.valid = false;
                passwordForm.newpasswordconfirm.valid = false;
                passwordForm.newpasswordconfirm.error = Resource.msg('error.message.resetpassword.invalidformentry', 'forms', null);
                res.render('account/password/newPassword', {
                    passwordForm: passwordForm,
                    token: token
                });
            } else {
                var email = resettingCustomer.profile.email;
                var url = URLUtils.https('Login-Show');
                var objectForEmail = {
                    firstName: resettingCustomer.profile.firstName,
                    lastName: resettingCustomer.profile.lastName,
                    url: url
                };

                var params = {
                    message: contentHelpers.getContentById('save-new-password-email', objectForEmail),
                };

                var emailObj = {
                    to: email,
                    subject: Resource.msg('subject.profile.resetpassword.email', 'login', null),
                    from: Site.current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@testorganization.com',
                    type: emailHelpers.emailTypes.passwordReset
                };

                emailHelpers.sendEmail(emailObj, 'email/assetContentEmail', params);
                res.redirect(URLUtils.url('Login-Show'));
            }
        });
    } else {
        res.render('account/password/newPassword', { passwordForm: passwordForm, token: token });
    }
    next();
});

module.exports = server.exports();
