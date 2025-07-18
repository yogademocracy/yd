'use strict';

const PageScriptContext = require('dw/experience/PageScriptContext');

/**
 * get JSON attributes
 * @param {Object} cmpDefinition component definition
 * @returns {Object} json attributes
 */
function getJSONAttrs(cmpDefinition) {
    let attrs = {};

    cmpDefinition.attribute_definition_groups.forEach(function (group) {
        group.attribute_definitions.forEach(function (definitions) {
            attrs[definitions.id] = definitions;
        });
    });

    return attrs;
}

/**
 * Format attributes from content.
 * @param {Object} context - model object for a component
 * @param {Object} model - model which we should decorate
 */
function formatAttributes(context, model) {
    const ProductFactory = require('*/cartridge/scripts/factories/product');
    // TODO: resolve DIS images
    // const DISHelpers = require('*/cartridge/scripts/helpers/DISHelpers');
    const ImageTransformation = require('*/cartridge/experience/utilities/ImageTransformation.js');
    let content = context.content;

    let isPage = context instanceof PageScriptContext;
    let cmpTypeID = isPage ? context.page.typeID : context.component.typeID;

    let cmpFilePath = cmpTypeID.replace('.', '/');
    let componentJSON = isPage
        ? require('*/cartridge/experience/pages/' + cmpFilePath + '.json')
        : require('*/cartridge/experience/components/' + cmpFilePath + '.json');
    let JSONAttrs = getJSONAttrs(componentJSON);

    for (var attrID in content) {
        let attrValue = content[attrID];
        let JSONAttrsObj = JSONAttrs[attrID];
        let attrType = JSONAttrsObj.type;

        // Debug specific component attribute

        // if (cmpTypeID === 'commerce_layouts.carousel' && attrID === 'title') {
        //     var debugAttrObj = attrValue;
        // }

        // End debug code

        // attrID: imgDesktop, imgMobile

        switch (attrType) {
            case 'image':
                // model[attrID] = DISHelpers.getScaledImageFromPageDesigner(attrID, attrValue);
                model[attrID] = ImageTransformation.getScaledImage(attrValue);
                model[attrID + 'Src'] = attrValue
                    ? ImageTransformation.url(attrValue, { device: attrID.toLowerCase().includes('mobile') ? 'mobile' : 'full' })
                    : null;
                break;
            case 'product':
                if (attrValue && attrValue.ID) {
                    try {
                        let productObj = ProductFactory.get({
                            pid: attrValue.ID
                        });
                        if (productObj) {
                            model[attrID] = productObj;
                        }
                    } catch (err) {
                        let Logger = require('dw/system/Logger');
                        Logger.error('Error during generated product model: ' + err.message);
                    }
                }

                break;
            case 'custom':
                if (JSONAttrsObj.editor_definition
                    && JSONAttrsObj.editor_definition.configuration
                    && JSONAttrsObj.editor_definition.configuration.skipAutoProcessing) {
                    break;
                }

                if (typeof attrValue === 'object' && attrValue.value) {
                    model[attrID] = attrValue.value;
                } else if (typeof attrValue === 'string') {
                    model[attrID] = attrValue || '';
                }

                break;
            case 'string':
                model[attrID] = attrValue || '';
                break;
            default:
                model[attrID] = attrValue;
        }
    }
}

module.exports = {
    formatAttributes: formatAttributes
};
