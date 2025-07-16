'use strict';

const componentBuilder = require('*/cartridge/experience/utilities/componentBuilder.js');

/**
 * Render Atom Picture component.
 * @param {dw.experience.ComponentScriptContext} context The component script context object.
 * @returns {string} The markup to be displayed
 */
module.exports.render = function (context) {
    const model = componentBuilder.init(context);

    model.inlineStyle = '';
    if (model.maxWidth) {
        model.inlineStyle += '--js-max-width:' + model.maxWidth + ';';
    }
    if (model.maxWidthMobile) {
        model.inlineStyle += '--js-max-width-mobile:' + model.maxWidthMobile + ';';
    }

    return componentBuilder.render('experience/components/commerce_atoms/atomPicture', model);
};
