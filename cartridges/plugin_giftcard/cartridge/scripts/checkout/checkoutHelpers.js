'use strict';

var base = module.superModule;

var Transaction = require('dw/system/Transaction');
var Money = require('dw/value/Money');

var GiftCertificateMgr = require('dw/order/GiftCertificateMgr');
var basketCalculationHelpers = require('*/cartridge/scripts/helpers/basketCalculationHelpers');

/**
 * Calculates the amount to be paid by a non-gift certificate payment instrument based on the given basket.
 * The function subtracts the amount of all redeemed gift certificates from the order total and returns this
 * value.
 * @param {dw.order.Basket} currentBasket - The current basket
 * @returns {dw.value.Money} The amount to be paid by a non-gift certificate payment instrument.
 */
function getNonGiftCertificateAmount(currentBasket) {
    // The total redemption amount of all gift certificate payment instruments in the basket.
    var giftCertTotal = new Money(0.0, currentBasket.getCurrencyCode());

    // Gets the list of all gift certificate payment instruments
    var gcPaymentInstrs = currentBasket.getGiftCertificatePaymentInstruments();
    var iter = gcPaymentInstrs.iterator();
    var orderPI = null;

    // Sums the total redemption amount.
    while (iter.hasNext()) {
        orderPI = iter.next();
        giftCertTotal = giftCertTotal.add(orderPI.getPaymentTransaction().getAmount());
    }

    // Gets the order total.
    var orderTotal = currentBasket.getTotalGrossPrice();

    // Calculates the amount to charge for the payment instrument.
    // This is the remaining open order total that must be paid.
    var amountOpen = orderTotal.subtract(giftCertTotal);

    // Returns the open amount to be paid.
    return amountOpen;
}

/**
 * Sets the payment transaction amount
 * @param {dw.order.Basket} currentBasket - The current basket
 * @returns {Object} an error object
 */
base.calculatePaymentTransaction = function (currentBasket) {
    var PaymentInstrument = require('dw/order/PaymentInstrument');
    var result = { error: false, message: '' };

    // Gets all payment instruments for the basket.
    var iter = currentBasket.getPaymentInstruments().iterator();
    var paymentInstrument = null;
    var nonGCPaymentInstrument = null;
    var giftCertTotal = new Money(0.0, currentBasket.getCurrencyCode());

    // Locates a non-gift certificate payment instrument if one exists.
    while (iter.hasNext()) {
        paymentInstrument = iter.next();
        if (PaymentInstrument.METHOD_GIFT_CERTIFICATE.equals(paymentInstrument.getPaymentMethod())) {
            giftCertTotal = giftCertTotal.add(paymentInstrument.getPaymentTransaction().getAmount());
            continue;
        }

        // Captures the non-gift certificate payment instrument.
        nonGCPaymentInstrument = paymentInstrument;
        break;
    }

    var orderTotal = currentBasket.totalGrossPrice;

    // If a gift certificate payment and non-gift certificate payment
    // instrument are found, the function returns true.
    if (!nonGCPaymentInstrument) {
        // If there are no other payment types and the gift certificate
        // does not cover the open amount, then return false.
        if (giftCertTotal.value >= orderTotal.value) {
            result.error = false;
        }

        return result;
    }

    try {
        Transaction.wrap(function () {
            // Calculates the amount to be charged for the
            // non-gift certificate payment instrument.
            var amount = getNonGiftCertificateAmount(currentBasket);

            // now set the non-gift certificate payment instrument total.
            if (amount.value <= 0.0) {
                var zero = new Money(0, amount.getCurrencyCode());
                nonGCPaymentInstrument.getPaymentTransaction().setAmount(zero);
            } else {
                nonGCPaymentInstrument.getPaymentTransaction().setAmount(amount);
            }
        });
    } catch (e) {
        result.error = true;
    }

    return result;
};

/**
 * Creates a gift certificate payment instrument from the given gift certificate ID for the basket. The
 * method attempts to redeem the current balance of the gift certificate. If the current balance exceeds the
 * order total, this amount is redeemed and the balance is lowered.
 *
 * @transactional
 * @param {dw.order.Basket} currentBasket - current basket
 * @param {dw.order.GiftCertificate} giftCertificate - The gift certificate.
 * @returns {dw.order.PaymentInstrument} The created PaymentInstrument.
 */
base.createGiftCertificatePaymentInstrument = function (currentBasket, giftCertificate) {
    // Removes any duplicates.
    // Iterates over the list of payment instruments to check.
    var gcPaymentInstrs = currentBasket.getGiftCertificatePaymentInstruments(giftCertificate.getGiftCertificateCode()).iterator();
    var existingPI = null;

    // Removes found gift certificates, to prevent duplicates.
    while (gcPaymentInstrs.hasNext()) {
        existingPI = gcPaymentInstrs.next();
        currentBasket.removePaymentInstrument(existingPI);
    }

    // Fetches the balance and the order total.
    var balance = giftCertificate.getBalance();
    var orderTotal = currentBasket.getTotalGrossPrice();

    // Sets the amount to redeem equal to the remaining balance.
    var amountToRedeem = balance;

    // Since there may be multiple gift certificates, adjusts the amount applied to the current
    // gift certificate based on the order total minus the aggregate amount of the current gift certificates.

    var giftCertTotal = new Money(0.0, currentBasket.getCurrencyCode());

    // Iterates over the list of gift certificate payment instruments
    // and updates the total redemption amount.
    gcPaymentInstrs = currentBasket.getGiftCertificatePaymentInstruments().iterator();
    var orderPI = null;

    while (gcPaymentInstrs.hasNext()) {
        orderPI = gcPaymentInstrs.next();
        giftCertTotal = giftCertTotal.add(orderPI.getPaymentTransaction().getAmount());
    }

    // Calculates the remaining order balance.
    // This is the remaining open order total that must be paid.
    var orderBalance = orderTotal.subtract(giftCertTotal);

    // The redemption amount exceeds the order balance.
    // use the order balance as maximum redemption amount.
    if (orderBalance < amountToRedeem) {
        // Sets the amount to redeem equal to the order balance.
        amountToRedeem = orderBalance;
    }

    // Creates a payment instrument from this gift certificate.
    return currentBasket.createGiftCertificatePaymentInstrument(giftCertificate.getGiftCertificateCode(), amountToRedeem);
};

/**
 * Loop through all giftCertificatePayment instruments of basket to check dubplicate
 * @param {dw.order.LineItemCtnr} lineItemContainer - Current users's basket
 * @returns {Count} - Number of total instore pickup items in cart
 */
base.isGcDuplicate = function (currentBasket, giftCertificate) {
    var gcPaymentInstrs = currentBasket.getGiftCertificatePaymentInstruments(giftCertificate.getGiftCertificateCode()).iterator();
    var isDuplicate = false;

    while (gcPaymentInstrs.hasNext()) {
        isDuplicate = true;
        gcPaymentInstrs.next();
    }

    return isDuplicate;
};

/**
 * ammount to redeem from the gift card
 * @param {dw.order.LineItemCtnr} lineItemContainer - Current users's basket
 * @returns {Count} - Number of total instore pickup items in cart
 */
base.getRedeemAmmount = function (currentBasket, giftCertificate) {
    var balance = giftCertificate.getBalance();
    var orderTotal = currentBasket.getTotalGrossPrice();

    // Sets the amount to redeem equal to the remaining balance.
    var amountToRedeem = balance;

    // Since there may be multiple gift certificates, adjusts the amount applied to the current
    // gift certificate based on the order total minus the aggregate amount of the current gift certificates.

    var giftCertTotal = new Money(0.0, currentBasket.getCurrencyCode());

    // Iterates over the list of gift certificate payment instruments
    // and updates the total redemption amount.
    var gcPaymentInstrs = currentBasket.getGiftCertificatePaymentInstruments().iterator();
    var orderPI = null;

    while (gcPaymentInstrs.hasNext()) {
        orderPI = gcPaymentInstrs.next();
        giftCertTotal = giftCertTotal.add(orderPI.getPaymentTransaction().getAmount());
    }

    // Calculates the remaining order balance.
    // This is the remaining open order total that must be paid.
    var orderBalance = orderTotal.subtract(giftCertTotal);

    // The redemption amount exceeds the order balance.
    // use the order balance as maximum redemption amount.
    if (orderBalance < amountToRedeem) {
        // Sets the amount to redeem equal to the order balance.
        amountToRedeem = orderBalance;
    }

    return amountToRedeem;
};

/**
 * renders the Gift Card payment
 * @param {Object} req - The request object
 * @param {dw.order.Basket} currentBasket - The account model for the current customer
 * @param {Object} paymentForm - payment form
 * @returns {string|null} newly stored payment Instrument
 */
base.getRenderedGCInstruments = function (req, currentBasket, paymentForm) {
    var Locale = require('dw/util/Locale');
    var OrderModel = require('*/cartridge/models/order');
    var AccountModel = require('*/cartridge/models/account');
    var renderTemplateHelper = require('*/cartridge/scripts/renderTemplateHelper');
    var csrfProtection = require('dw/web/CSRFProtection');
    var usingMultiShipping = req.session.privacyCache.get('usingMultiShipping');
    var currentLocale = Locale.getLocale(req.locale.id);

    var basketModel = new OrderModel(
        currentBasket, {
            usingMultiShipping: usingMultiShipping,
            countryCode: currentLocale.country,
            containerView: 'basket'
        }
    );

    var accountModel = new AccountModel(req.currentCustomer);

    var context = {};
    context.order = basketModel;
    context.forms = {
        billingForm: paymentForm
    };
    context.customer = accountModel;

    // Get rid of this from top-level ... should be part of OrderModel???
    var currentYear = new Date().getFullYear();
    var creditCardExpirationYears = [];

    for (var j = 0; j < 10; j++) {
        creditCardExpirationYears.push(currentYear + j);
    }

    context.expirationYears = creditCardExpirationYears;
    context.csrf = {
        tokenName: csrfProtection.getTokenName(),
        token: csrfProtection.generateToken()
    };


    return renderTemplateHelper.getRenderedHtml(context, 'checkout/billing/billing');
};

/**
 * Removes a gift certificate payment instrument with the given gift certificate ID
 * from the basket.
 *
 * @transactional
 * @param {dw.order.Basket} currentBasket - current basket
 * @param {string} giftCertificateID - The ID of the gift certificate to remove the payment instrument for.
 */
base.removeGiftCertificatePaymentInstrument = function (currentBasket, giftCertificateID) {
    // Iterates over the list of payment instruments.
    var gcPaymentInstrs;
    if (!empty(giftCertificateID)) {
        gcPaymentInstrs = currentBasket.getGiftCertificatePaymentInstruments(giftCertificateID);
    } else {
        gcPaymentInstrs = currentBasket.getGiftCertificatePaymentInstruments();
    }
    var iter = gcPaymentInstrs.iterator();
    var existingPI = null;

    Transaction.wrap(function () {
        // Remove (one or more) gift certificate payment
        // instruments for this gift certificate ID.
        while (iter.hasNext()) {
            existingPI = iter.next();
            currentBasket.removePaymentInstrument(existingPI);
        }
    });
    return;
};

/**
 * Updates a gift certificate payment instrument
 *
 * @transactional
 * @param {dw.order.Basket} currentBasket - current basket
 */
base.updateGiftCertificatePaymentInstrument = function (currentBasket) {
    var appliedGiftCertificates = currentBasket.getGiftCertificatePaymentInstruments();
    if (appliedGiftCertificates.length > 0) {
        var existingPI = null;
        var iter = appliedGiftCertificates.iterator();
        var giftCertCodes = [];
        var giftCertCode;
        Transaction.wrap(function () {
            while (iter.hasNext()) {
                existingPI = iter.next();
                giftCertCode = existingPI.getGiftCertificateCode();
                base.removeGiftCertificatePaymentInstrument(currentBasket, giftCertCode);
                giftCertCodes.push(giftCertCode);
            }
            if (!empty(giftCertCodes)) {
                for (var i = 0; i < giftCertCodes.length; i++) {
                    giftCertCode = giftCertCodes[i];
                    var giftCert = GiftCertificateMgr.getGiftCertificateByCode(giftCertCode);
                    if (base.getRedeemAmmount(currentBasket, giftCert) > 0.0) {
                        currentBasket.createGiftCertificatePaymentInstrument(giftCertCode, base.getRedeemAmmount(currentBasket, giftCert));
                    } else {
                        continue;
                    }
                }
            }
            basketCalculationHelpers.calculateTotals(currentBasket);
        });
    }
};

/**
 * Checks if OrderTotal is covered by GC
 * @transactional
 * @param {dw.order.Basket} currentBasket - current basket
 */
base.isCreditPaymentRequired = function (currentBasket) {
    var orderTotal = currentBasket.getTotalGrossPrice();
    var giftCertTotal = new Money(0.0, currentBasket.getCurrencyCode());
    var isCCRequired = false;

    // Iterates over the list of gift certificate payment instruments
    var gcPaymentInstrs = currentBasket.getGiftCertificatePaymentInstruments().iterator();
    var orderPI = null;

    while (gcPaymentInstrs.hasNext()) {
        orderPI = gcPaymentInstrs.next();
        giftCertTotal = giftCertTotal.add(orderPI.getPaymentTransaction().getAmount());
    }

    if (orderTotal > giftCertTotal) {
        isCCRequired = true;
    }

    return isCCRequired;
};

module.exports = base;
