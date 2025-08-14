'use strict';

var Cleave = require('cleave.js').default;

var base = require('base/components/cleave');

base.handleCreditCardNumber = function (cardFieldSelector, cardTypeSelector) {
    var cleave = new Cleave(cardFieldSelector, { // eslint-disable-line no-undef
        creditCard: true,
        onCreditCardTypeChanged: function (type) {
            window.ccType = type;
            var creditCardTypes = {
                visa: 'Visa',
                mastercard: 'Master Card',
                amex: 'American Express',
                discover: 'Discover',
                maestro: 'Maestro',
                jcb: 'JCB',
                diners: 'DinersClub',
                unknown: 'Unknown'
            };
            var cardType = creditCardTypes[Object.keys(creditCardTypes).indexOf(type) > -1
                ? type
                : 'unknown'];
            $(cardTypeSelector).val(cardType);
            $('.card-number-wrapper').attr('data-type', type);
            if (type === 'visa' || type === 'mastercard' || type === 'discover') {
                $('#securityCode').attr('maxlength', 3);
            } else {
                $('#securityCode').attr('maxlength', 4);
            }
        }
    });

    // eslint-disable-next-line
    var cleaveSecurityCode = new Cleave('#securityCode', {
        numericOnly: true,
        delimiter: '',
        numeral: true,
    });
 
    if($('#saved-payment-security-code').length){
        // eslint-disable-next-line
        var cleaveSavedPaymentSecurityCode = new Cleave('#saved-payment-security-code', {
            numericOnly: true,
            delimiter: '',
            numeral: true,
        });
    }

    $(cardFieldSelector).data('cleave', cleave);
};

module.exports = base;
