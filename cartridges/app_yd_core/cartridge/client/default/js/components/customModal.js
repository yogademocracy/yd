'use strict';

import util from '../util';

/**
 * Custom modal opening
 * @param {jQuery} $btn - open modal button
 * @param {Function} beforeShowCallback - before show modal callback
 * @return {void}
 */
function customModalOpening($btn, beforeShowCallback) {
    var action = $btn.data('action-url');
    var searchParams = new URLSearchParams(action.split('?')[1]);
    var modalId = searchParams.get('modalID');
    var replaceModal = searchParams.get('replaceModal');

    var $modal = $('#' + modalId);

    if (replaceModal) {
        $modal.remove();
    } else if ($modal.length) {
        if (beforeShowCallback) {
            beforeShowCallback();
        }

        $modal.modal('show');

        return;
    }

    $.spinner().start();

    $.ajax({
        url: action,
        method: 'GET',
        dataType: 'html',
        success: function (response) {
            $('body').append(response);

            if (beforeShowCallback) {
                beforeShowCallback();
            }

            $('#' + modalId).modal('show');
        },
        complete: function () {
            $.spinner().stop();
        }
    });
}

/**
 * Initialization module function
 */
export default function () {
    var $modals = $('.js-modal');

    if ($modals.length > 0) {
        $modals.each(function () {
            var $modal = $(this);
            var modalId = $modal.data('modal-id');

            if (!util.getCookie('closed-' + modalId)) {
                $modal.removeClass('m-hidden');
            }
        });
    }

    $('body').on('customModal:show', function () {
        setTimeout(function () {
            $('.js-modal').removeClass('m-hidden');
        }, 100);
    });

    $(document).on('click touchstart', '.js-modal-close', function () {
        var $this = $(this);
        var $modal = $this.closest('.js-modal');

        if ($this.attr('data-redirect-url-after-close')) {
            window.location.href = $this.attr('data-redirect-url-after-close');
        } else {
            var modalId = $modal.data('modal-id');

            $modal.addClass('m-hidden');

            if (modalId) {
                util.setCookie('closed-' + modalId, true);
            }

            var transitionDuration = $('.js-modal_inner').css('transition-duration');
            var timeoutDuration = 300;

            if (transitionDuration) {
                timeoutDuration = Number(transitionDuration.replace(/\D+/g, '')) * 100 || 300;
            }

            setTimeout(function () {
                $modal.remove();
            }, timeoutDuration);
        }
    });

    $(document).on('click', '.js-open-custom-modal', function () {
        customModalOpening($(this));
    });

    $(document).on('customModal:opening', function (e, data) {
        customModalOpening(data.$openModalBtn, data.beforeShowCallback);
    });
};
