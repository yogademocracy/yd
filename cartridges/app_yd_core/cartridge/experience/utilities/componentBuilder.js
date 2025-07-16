'use strict';

const HashMap = require('dw/util/HashMap');
const Template = require('dw/util/Template');

const parentAttrName = 'data-parent-pdcmp';
let isFirstComponent = true;

/**
 * Helper to encapsulate common code for building PD component
 *
 * @param {Object} context - model object for a component
 * @param {Object} [builderParamsObj] - builderParams
 * Example of builderParamsObj
 *   var builderParamsObj = {
 *       regions: {
 *           slides: {
 *               componentClassName: 'b-carousel__slide'
 *           }
 *       }
 *   };
 * @return {Object} model - prepared model
 */
function init(context, builderParamsObj) {
    let model = new HashMap();
    let builderParams = builderParamsObj || {};
    let pageDesignerHelpers = require('*/cartridge/experience/utilities/pageDesignerHelpers');

    let PageRenderHelper = require('*/cartridge/experience/utilities/PageRenderHelper.js');

    let cmpTypeID = context.component.typeID;
    let cmpNameIndexName = cmpTypeID.lastIndexOf('.');
    let cmpName = cmpTypeID.substring(cmpNameIndexName + 1);

    // Debug specific component

    // if (cmpTypeID === 'commerce_layouts.carousel') {
    //     var debugComponentObj = context.component;
    // }

    // End debug code

    model.regions = PageRenderHelper.getRegionModelRegistry(context.component);
    model.regionsHtml = {};
    model.cmpName = cmpName;
    model.id = cmpName + '-' + context.component.getID();

    for (var regionID in model.regions) {
        if (Object.prototype.hasOwnProperty.call(model.regions, regionID) && regionID !== 'container') {
            if (builderParams.regions && builderParams.regions[regionID]) {
                if (builderParams.regions[regionID].componentClassName) {
                    // todo: fix issue
                    model.regions[regionID].setComponentClassName(builderParams.regions[regionID].componentClassName);
                }
            }
            let regionItem = model.regions[regionID];

            if (regionItem.constructor.name === 'RegionModel') {
                // Set parent component ID
                model.regions[regionID].setComponentAttribute(parentAttrName, cmpName);
            }
        }
    }

    pageDesignerHelpers.formatAttributes(context, model);

    model.isFirstComponent = false;

    if (isFirstComponent) {
        model.isFirstComponent = true;
        isFirstComponent = false;
    }

    return model;
}

/**
 * Render helper
 *
 * @param {Object} path - string
 * @param {Object} model - model
 * @param {boolean} [removeWrappers] - set TRUE to remove extra 'experience' wrapper
 * @return {Object} string
 */
function render(path, model, removeWrappers) {
    let regionHtml = new Template(path).render(model).text;

    if (removeWrappers) {
        regionHtml = regionHtml.replace(/(?:\s*<div[^<>]*?>\s*){2}([^]*)(?:\s*<\/div[^<>]*?>\s*){2}$/, '$1');
    }

    return regionHtml;
}

module.exports = {
    init: init,
    render: render
};
