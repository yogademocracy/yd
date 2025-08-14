'use strict';

const componentBuilder = require('*/cartridge/experience/utilities/componentBuilder.js');

/**
 * Render Slider layout.
 * @param {dw.experience.ComponentScriptContext} context The component script context object.
 * @returns {string} The markup to be displayed
 */
module.exports.render = function (context) {
    const model = componentBuilder.init(context);
    model.sliderSettingsJSON = context.content.sliderSettingsJSON;

    return componentBuilder.render('experience/components/commerce_layouts/swiperSlider', model);
};
