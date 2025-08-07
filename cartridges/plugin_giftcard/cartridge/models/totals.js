'use strict';

var base = module.superModule;

var formatMoney = require('dw/util/StringUtils').formatMoney;
var Money = require('dw/value/Money');

var collections = require('*/cartridge/scripts/util/collections');

/**
 * @constructor
 * @classdesc totals class that represents the order totals of the current line item container
 *
 * @param {dw.order.lineItemContainer} lineItemContainer - The current user's line item container
 */
function totals(lineItemContainer) {
    base.call(this, lineItemContainer);

    if (lineItemContainer) {
        var giftCertificatesApplied = new Money(0, lineItemContainer.getCurrencyCode());

        collections.forEach(lineItemContainer.giftCertificatePaymentInstruments, function (giftCertificatePi) {
            if (giftCertificatePi.paymentTransaction && giftCertificatePi.paymentTransaction.amount && giftCertificatePi.paymentTransaction.amount.getValue() > 0) {
                giftCertificatesApplied = giftCertificatesApplied.add(giftCertificatePi.paymentTransaction.amount);
            }
        });

        if (giftCertificatesApplied.getValue() > 0) {
            var totalGrossPrice = lineItemContainer.totalGrossPrice.subtract(giftCertificatesApplied);

            this.grandTotal = totalGrossPrice.available ? formatMoney(totalGrossPrice) : '-';
        }

        this.giftCertificatesTotal = {
            value: giftCertificatesApplied.getValue(),
            formatted: formatMoney(giftCertificatesApplied)
        };
    }
}

module.exports = totals;
