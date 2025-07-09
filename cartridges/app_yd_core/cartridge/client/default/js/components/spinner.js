'use strict';

/**
 * Show a spinner inside a given element
 * @param {jQuery} $target - Element to block by the veil and spinner.
 *                            Pass body to block the whole page.
 */
function addSpinner($target) {
    if ($target.hasClass('js-veiled')) {
        return;
    }

    var $targetParent = $target.parent();
    $targetParent = $targetParent.get(0).tagName === 'PICTURE' ? $targetParent.parent() : $targetParent;
    var $veil = $('<div class="veil js-veil"><div class="underlay"></div></div>');
    $veil.append('<div class="spinner"><div class="dot1"></div><div class="dot2"></div></div>');
    if ($target.get(0).tagName === 'IMG') {
        $target.after($veil);
        $veil.css({ width: $target.width(), height: $target.height() });
        if ($targetParent.css('position') === 'static') {
            $targetParent.css('position', 'relative');
            $targetParent.addClass('js-temporary-relative');
        }

        $targetParent.addClass('js-veiled');
    } else {
        $target.append($veil);
        if ($target.css('position') === 'static') {
            $target.css('position', 'relative');
            $target.addClass('js-temporary-relative');
        }
        if ($target.get(0).tagName === 'BODY') {
            $veil.css('position', 'fixed');
            $veil.find('.spinner').css('position', 'fixed');
        }

        $target.addClass('js-veiled');
    }

    $veil.click(function (e) {
        e.stopPropagation();
    });
}

/**
 * Remove existing spinner and sub-spinners
 * @param  {element} $targets - jQuery pointer to the veiled element
 */
function removeSpinner($targets) {
    $targets.find('.js-veiled').addBack().each(function () {
        var $target = $(this);

        var $veils;
        if ($target.get(0).tagName === 'IMG' && $target.hasClass('js-veiled')) {
            $veils = $target.next();
        } else {
            $veils = $target.find('.js-veil');
        }

        $veils.each(function () {
            var $veil = $(this);

            var $veilParent = $veil.parent();
            if ($veilParent.hasClass('js-temporary-relative')
                && $veilParent.children('.js-veiled').length <= 1) {
                $veilParent.css('position', '');
                $veilParent.removeClass('js-temporary-relative');
            }

            $veil.off('click');
            $veil.remove();
        });

        $target.removeClass('js-veiled');
    });
}

// element level spinner:
$.fn.spinner = function () {
    var $element = $(this);
    var Fn = function () {
        this.start = function () {
            if ($element.length) {
                addSpinner($element);
            }
        };
        this.stop = function () {
            if ($element.length) {
                removeSpinner($element);
            }
        };
    };
    return new Fn();
};

// page-level spinner:
$.spinner = function () {
    var Fn = function () {
        this.start = function () {
            addSpinner($('body'));
        };
        this.stop = function () {
            removeSpinner($('body'));
        };
    };
    return new Fn();
};
