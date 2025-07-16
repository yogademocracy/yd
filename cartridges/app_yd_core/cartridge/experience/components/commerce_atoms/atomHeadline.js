'use strict';

const componentBuilder = require('*/cartridge/experience/utilities/componentBuilder.js');

/**
 * Render Atom Headline component.
 * @param {dw.experience.ComponentScriptContext} context The component script context object.
 * @returns {string} The markup to be displayed
 */
module.exports.render = function (context) {
    const model = componentBuilder.init(context);

    return componentBuilder.render('experience/components/commerce_atoms/atomHeadline', model, true);
};
