/* eslint-disable no-undef */

'use strict';

var cybersource = require('cybersource/checkout/billing');

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

cybersource.handleCreditCardNumber = function () {
    if ($('.cardNumber').length && $('#cardType').length) {
        cleave.handleCreditCardNumber('.cardNumber', '#cardType');
    }
};

module.exports = cybersource;
