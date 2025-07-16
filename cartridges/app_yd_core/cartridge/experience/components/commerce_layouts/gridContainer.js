'use strict';

const ComponentRenderSettings = require('dw/experience/ComponentRenderSettings');
const PageMgr = require('dw/experience/PageMgr');
const RegionRenderSettings = require('dw/experience/RegionRenderSettings');
const collections = require('*/cartridge/scripts/util/collections');
const componentBuilder = require('*/cartridge/experience/utilities/componentBuilder.js');

const columnClassPrefix = 'region col-12 col-md-';
const mapContentWidthConfig = {
    '12-columns width': { type: '12-columns', contentClass: 'col' },
    '10-columns width': { type: '10-columns', contentClass: 'col-md-10 offset-md-1' },
    '8-columns width': { type: '8-columns', contentClass: 'col-md-8 offset-md-2' },
    '6-columns width': { type: '6-columns', contentClass: 'col-md-6 offset-md-3' }
};

/**
 * Render Grid container layout.
 * @param {dw.experience.ComponentScriptContext} context The component script context object.
 * @returns {string} The markup to be displayed
 */
module.exports.render = function (context) {
    const model = componentBuilder.init(context);

    model.containerWidthClass = 'container-fluid ' + (model.containerWidth || '');
    model.columnClass = '';
    model.rowClass = 'grid-container__content ' + model.contentCSSClasses;
    model.visibleRegionsCount = model.regions.columns.region.visibleComponents.length;
    model.decorator = 'experience/decorators/emptyDecorator';

    if (model.contentWidth) {
        model.contentWidthConfig = mapContentWidthConfig[model.contentWidth];
        model.contentWidthType = model.contentWidthConfig.type;

        model.columnClass = columnClassPrefix + Math.floor(12 / model.visibleRegionsCount);
        model.rowClass += ' row';
        model.decorator = 'experience/decorators/containerContentDecorator';
    }

    // we have configuration of columns so we need to run custom renderer to assign correct column widths
    if (model.columnsWidthConfig) {
        model.columnsWidthConfig = model.columnsWidthConfig.split(' '); // convert to array;

        const region = model.regions.columns.region;
        const regionRenderSettings = new RegionRenderSettings();
        const visibleComponents = region.visibleComponents;

        regionRenderSettings.setAttributes({ class: model.rowClass });

        collections.forEach(visibleComponents, function (comp, i) {
            const componentRenderSettings = new ComponentRenderSettings();

            componentRenderSettings.setAttributes({ class: columnClassPrefix + model.columnsWidthConfig[i] });
            regionRenderSettings.setComponentRenderSettings(comp, componentRenderSettings);
        });

        // Render the region with the custom render settings.
        model.renderedCustomColumns = PageMgr.renderRegion(region, regionRenderSettings);
    }

    return componentBuilder.render('experience/components/commerce_layouts/gridContainer', model);
};
