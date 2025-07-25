import Drift from 'drift-zoom';

$('.js-image-zoom').each(function () {
    const settings = {
        inlinePane: true,
        injectBaseStyles: true,
        zoomFactor: 2,
        sourceAttribute: 'src'
    };

    new Drift(this, settings);
});
