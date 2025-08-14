'use strict';

var server = require('server');
var checkoutServices = module.superModule;

server.extend(checkoutServices);

var Resource = require('dw/web/Resource');
var BasketMgr = require('dw/order/BasketMgr');
var Transaction = require('dw/system/Transaction');

var csrfProtection = require('*/cartridge/scripts/middleware/csrf');

/**
 * Rednerd the gift certificate form to edit an existing added certificate
 */
server.get('RemoveGiftCertificate', server.middleware.https, function (req, res, next) {
    var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');
    var basketCalculationHelpers = require('*/cartridge/scripts/helpers/basketCalculationHelpers');
    var giftCertCode = req.querystring.giftCertificateID;

    if (!empty(giftCertCode)) {
        var currentBasket = BasketMgr.getCurrentOrNewBasket();

        Transaction.wrap(function () {
            COHelpers.removeGiftCertificatePaymentInstrument(currentBasket, giftCertCode);
            basketCalculationHelpers.calculateTotals(currentBasket);
            COHelpers.updateGiftCertificatePaymentInstrument(currentBasket);
        });

        res.json({
            success: true
        });

    } else {
        res.json({
            error: true,
            errorMessage: Resource.msg('error.invalid', 'giftcard', null)
        });
    }

    return next();
});

/**
 * Get GC BALANCE
 */
server.get('CheckBalance', server.middleware.https, function (req, res, next) {
    var formatMoney = require('dw/util/StringUtils').formatMoney;
    var GiftCertificateMgr = require('dw/order/GiftCertificateMgr');
    var giftCertCode = req.querystring.giftCertCode;

    // fetch the gift certificate
    var giftCertificate = GiftCertificateMgr.getGiftCertificateByCode(giftCertCode);

    if (!empty(giftCertificate) && giftCertificate.isEnabled()) {
        res.json({
            giftCertificate: {
                ID: giftCertificate.getGiftCertificateCode(),
                balance: Resource.msgf('billing.balance', 'giftcard', null, formatMoney(giftCertificate.getBalance()))
            }
        });
    } else {
        res.json({
            error: Resource.msg('error.invalid', 'giftcard', null)
        });
    }

    return next();
});

/**
 * Rednerd the gift certificate form to edit an existing added certificate
 */
server.post('AddGiftCertificate', server.middleware.https, csrfProtection.validateAjaxRequest, function (req, res, next) {
    var GiftCertificateMgr = require('dw/order/GiftCertificateMgr');
    var URLUtils = require('dw/web/URLUtils');

    var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');
    var basketCalculationHelpers = require('*/cartridge/scripts/helpers/basketCalculationHelpers');
    var formErrors = require('*/cartridge/scripts/formErrors');

    var currentBasket = BasketMgr.getCurrentOrNewBasket();
    var result = '';

    if (!currentBasket) {
        res.json({
            error: true,
            redirectUrl: URLUtils.url('Cart-Show').toString()
        });
        return next();
    }

    var paymentForm = server.forms.getForm('billing');
    var giftCertCode = paymentForm.giftCertFields.giftCertCode;

    if (empty(giftCertCode.htmlValue)) {
        giftCertCode.valid = false;
        giftCertCode.error = Resource.msg('error.invalid', 'giftcard', null);
        paymentForm.valid = false;

        res.json({
            fields: formErrors.getFormErrors(paymentForm)
        });

        return next();
    }

    if (!empty(giftCertCode.htmlValue)) {
        var gc = GiftCertificateMgr.getGiftCertificateByCode(giftCertCode.htmlValue);

        if (!gc || !gc.isEnabled() || (gc.getStatus() === gc.STATUS_PENDING)) { // make sure exists
            result = Resource.msg('error.invalid', 'giftcard', null);
        } else if (gc.getStatus() === gc.STATUS_REDEEMED) { // make sure it has not been fully redeemed
            result = Resource.msg('error.no.funds', 'giftcard', null);
        } else if (COHelpers.isGcDuplicate(currentBasket, gc)) { // make sure gc is not duplicate
            result = Resource.msgf('error.duplicate', 'giftcard', null, gc.maskedGiftCertificateCode);
        } else {
            var ammountToRedeem = COHelpers.getRedeemAmmount(currentBasket, gc);

            Transaction.wrap(function () {
                currentBasket.createGiftCertificatePaymentInstrument(gc.getGiftCertificateCode(), ammountToRedeem);
                basketCalculationHelpers.calculateTotals(currentBasket);
            });

            res.json({
                error: false
            });

            return next();
        }
    }

    res.json({
        error: true,
        errorMessage: result
    });

    return next();
});

module.exports = server.exports();