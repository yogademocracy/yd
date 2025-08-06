'use strict';

/**
 * Checks if user has entered gift certificate or not.
 * @return {boolean} true/false
 */
var validateGiftCert = function () {
    var elm = $('.giftCertCode');
    if (elm.length === 0 || elm.val().length === 0) {
        var errorMessage = $('.gift-cert-wrapper').data('missing-error');
        $('#giftCertInvalidMessage').html(errorMessage);
        elm.addClass('is-invalid input-feedback');
        $('.balance, .current-balance').hide();
        return true;
    }

    $('#giftCertInvalidMessage').html('');
    elm.removeClass('is-invalid input-feedback');
    return false;
};

module.exports = {
    addGiftCertToBasket: function () {
        $('body').on('click', '.submit-giftCert', function (e) {
            e.preventDefault();
            var $balance = $('.balance');
            $balance.html('').removeClass('error').addClass('success');
            if (validateGiftCert()) {
                return false;
            }

            $('.current-balance').hide();

            var billingAddressForm = $('#dwfrm_billing .billing-address-block :input').serialize();

            $('body').trigger('checkout:serializeBilling', {
                form: $('#dwfrm_billing .billing-address-block'),
                data: billingAddressForm,
                callback: function (data) {
                    if (data) {
                        billingAddressForm = data;
                    }
                }
            });

            var paymentInfoSelector = '#giftCert';
            var paymentInfoForm = $(paymentInfoSelector).serialize();

            $('body').trigger('checkout:serializeBilling', {
                form: $(paymentInfoSelector),
                data: paymentInfoForm,
                callback: function (data) {
                    if (data) {
                        paymentInfoForm = data;
                    }
                }
            });

            var paymentForm = billingAddressForm + '&' + paymentInfoForm;
            $balance = $('.balance');
            $.ajax({
                url: $(this).data('url'),
                type: 'post',
                dataType: 'json',
                data: paymentForm,
                success: function (data) {
                    if (data.error) {
                        if (data.redirectUrl) {
                            window.location.href = data.redirectUrl;
                        } else if (data.errorMessage) {
                            $balance.html(data.errorMessage).removeClass('success').addClass('error').show();
                            return;
                        }
                    } else {
                        window.location.reload();
                    }
                },
                error: function (err) {
                    if (err.responseJSON && err.responseJSON.redirectUrl) {
                        window.location.href = err.responseJSON.redirectUrl;
                    }
                    window.location.reload();
                }
            });

            return false;
        });
    },
    checkBalance: function () {
        $('body').on('click', '.check-balance', function (e) {
            e.preventDefault();
            if (validateGiftCert()) {
                return false;
            }

            var giftCertCode = $('.giftCertCode').val();
            var $balance = $('.current-balance');
            var url = $(this).data('url');
            $('.balance').hide();

            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json',
                data: { giftCertCode: giftCertCode },
                success: function (data) {
                    if (!data.giftCertificate) {
                        $balance.html(data.error).show();
                        return;
                    }
                    $balance.html(data.giftCertificate.balance).show();
                }
            });

            return false;
        });
    },
    deleteGiftCert: function () {
        $('body').on('click', '.giftcert-pi .remove', function (e) {
            e.preventDefault();
            var url = $(this).attr('href');
            var $balance = $('.balance');
            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json',
                success: function (data) {
                    if (data.error) {
                        $balance.html(data.errorMessage).removeClass('success').addClass('error');
                    } else {
                        window.location.reload();
                    }
                },
                error: function () {
                    window.location.reload();
                }
            });
        });
    },

    updatePaymentMethodId: function () {
        $('body').on('click', '.nav-tabs li', function () {
            var method = $(this).data('method-id');
            $('.payment-information').attr('data-payment-method-id', method);
            $('.payment-information').data('payment-method-id', method);
        });
    },

    toggleGiftCertiface: function () {
        $('body').on('click', '.js-giftcard-toggle', function () {
            $(this).children('.fa').toggleClass('fa-chevron-up fa-chevron-down');
            $('.js-giftcard-fieldset').toggleClass('d-none');
        });
    }
};
