'use strict';

var Money = require('dw/value/Money');
var StringUtils = require('dw/util/StringUtils');
var Calendar = require('dw/util/Calendar');
var Resource = require('dw/web/Resource');
var Site = require('dw/system/Site');

var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');

// This is an additional emailType enumeration beyond the enumerations
// exported by emailHelpers.js. It can be used by the receiver of the
// app.customer.email hook to determine the type of transactional
// email is being send to an email service provider.
var SHIPPING_LABEL_EMAIL_TYPE = 7;

/**
 * Format the money amount base on the currency code
 * @param {string} amount - the amount in plain number
 * @param {string} currencyCode - the currency code for the amount
 * @returns {string} the formatted money value
 */
function formatMoney(amount, currencyCode) {
    var moneyObj = new Money(amount, currencyCode);
    var formatedMoney = StringUtils.formatMoney(moneyObj);
    return formatedMoney;
}

/**
 * Calculate the total price base on amount and quantity
 * @param {string} amount - the individual cost
 * @param {string} quantity - the quantity
 * @param {string} currencyCode - the currency code for the amount
 * @returns {string} the total price
 */
function calculateTotalPrice(amount, quantity, currencyCode) {
    var value = 0;
    if (currencyCode !== undefined && (amount || amount === 0)) {
        var moneyObj = new Money(amount, currencyCode);
        var totalPriceObj = moneyObj.multiply(parseInt(quantity, 10));
        value = totalPriceObj.value;
    } else {
        throw new Error('currency code is not specified');
    }
    return value;
}

/**
 * Convert date string to Date object
 * @param {string} dateString - a date string in the format of yyyy-mm-ddThh:mm:ss.000+0000 (i.e. 2020-06-18T20:42:34.000+0000)
 * @returns {Date} the date of yyyy-mm-dd
 */
function convertDateStringToDateObject(dateString) {
    var dateSegments = dateString.split('T')[0].split('-');
    var year = parseInt(dateSegments[0], 10);
    var month = parseInt(dateSegments[1], 10) - 1;
    var dayOfMonth = parseInt(dateSegments[2], 10);

    var calendarObj = new Calendar();
    calendarObj.set(year, month, dayOfMonth);
    var dateObj = calendarObj.getTime();

    return dateObj;
}

/**
 * Sends a transactional email to customer with return shipping label details.
 *
 * @param {Object} orderSummary - SOM API order summary object
 * @param {string} shippingLabelLink - Link to shipping label
 */
function sendShippingLabelEmail(orderSummary, shippingLabelLink) {
    var context = {
        orderSummary: orderSummary,
        shippingLabelLink: shippingLabelLink
    };

    var emailObj = {
        to: orderSummary.billing.address.email,
        subject: Resource.msg('subject.shipping.label.email', 'orderReturn', null),
        from: Site.current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@testorganization.com',
        type: SHIPPING_LABEL_EMAIL_TYPE
    };

    emailHelpers.sendEmail(emailObj, 'account/order/shippingLabelEmail', context);
}

module.exports = {
    calculateTotalPrice: calculateTotalPrice,
    convertDateStringToDateObject: convertDateStringToDateObject,
    formatMoney: formatMoney,
    sendShippingLabelEmail: sendShippingLabelEmail,
    shippingLabelEmailType: SHIPPING_LABEL_EMAIL_TYPE
};
