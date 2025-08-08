/* eslint-disable no-undef */

'use strict';

var cybersource = require('cybersource/checkout/billing');
var cleave = require('cybersource/checkout/cleave');

/**
 * Validate and update payment instrument form fields
 * @param {Object} order - the order model
 */
cybersource.methods.validateAndUpdateBillingPaymentInstrument = function (order) {
    var billing = order.billing;
    if (!billing.payment || !billing.payment.selectedPaymentInstruments
        || billing.payment.selectedPaymentInstruments.length <= 0) return;

    var form = $('form[name=dwfrm_billing]');
    if (!form) return;

    var instrument = billing.payment.selectedPaymentInstruments[0];
    $('select[name$=expirationMonth]', form).val(instrument.expirationMonth);
    $('select[name$=expirationYear]', form).val(instrument.expirationYear);
    // Force security code and card number clear
    $('input[name$=securityCode]', form).val('');

    if ($('input[name$=cardNumber]').length) {
        $('input[name$=cardNumber]').data('cleave').setRawValue('');
    }
};

/**
 * Updates the payment information in checkout, based on the supplied order model
 * @param {Object} order - checkout model to use as basis of new truth
 */
cybersource.methods.updatePaymentInformation = function (order) {
    // update payment details
    var $paymentSummary = $('.payment-details');
    var htmlToAppend = '';

    if (order.billing.payment && order.billing.payment.selectedPaymentInstruments
        && order.billing.payment.selectedPaymentInstruments.length > 0) {
        var paymentInstruments = order.billing.payment.selectedPaymentInstruments;

        for (var i = 0; i < paymentInstruments.length; i++) {
            if (paymentInstruments[i].paymentMethod === 'GIFT_CERTIFICATE') {
                htmlToAppend += '<div><span>' + order.resources.giftCertificateMessage + ' '
                    + '</span><div>'
                    + paymentInstruments[i].maskedGiftCertificateCode
                    + '</div></div>';
            } else {
                htmlToAppend += '<div><span>' + order.resources.cardType + ' '
                    + paymentInstruments[i].type
                    + '</span><div>'
                    + paymentInstruments[i].maskedCreditCardNumber
                    + '</div><div><span>'
                    + order.resources.cardEnding + ' '
                    + paymentInstruments[i].expirationMonth
                    + '/' + paymentInstruments[i].expirationYear
                    + '</span></div></div>';
            }
        }
    }

    $paymentSummary.empty().append(htmlToAppend);
};

cybersource.handleCreditCardNumber = function () {
    if ($('.cardNumber').length && $('#cardType').length) {
        cleave.handleCreditCardNumber('.cardNumber', '#cardType');
    }
};

module.exports = cybersource;
