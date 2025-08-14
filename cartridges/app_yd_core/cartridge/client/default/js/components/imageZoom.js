import Drift from 'drift-zoom';

/**
 * Init zoom on PDP images
 */
function initZoom() {
    $('.js-image-zoom').each(function () {
        const settings = {
            inlinePane: true,
            injectBaseStyles: true,
            zoomFactor: 2,
            sourceAttribute: 'src'
        };

        new Drift(this, settings);
    });
}

$('body').on('product:afterAttributeSelect', function () {
    initZoom();
});

initZoom();
