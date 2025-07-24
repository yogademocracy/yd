import Drift from 'drift-zoom';

$('.js-image-zoom').each(function () {
    const $image = $(this);
    const settings = {
        inlinePane: true,
        injectBaseStyles: true,
        zoomFactor: 2,
        sourceAttribute: 'src'
    };

    new Drift($image[0], settings);
});
