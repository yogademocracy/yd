'use strict';

var base = module.superModule;

var baseGetAllBreadcrumbs = base.getAllBreadcrumbs;

/**
 * Creates the breadcrumbs object
 * @param {string} cgid - category ID from navigation and search
 * @param {string} pid - product ID
 * @param {Array} breadcrumbs - array of breadcrumbs object
 * @returns {Array} an array of breadcrumb objects
 */
function getAllBreadcrumbs(cgid, pid, breadcrumbs) {
    var Resource = require('dw/web/Resource');
    var URLUtils = require('dw/web/URLUtils');
    var allBreadcrumbs = baseGetAllBreadcrumbs(cgid, pid, breadcrumbs);
   
    allBreadcrumbs.push({
        htmlValue: Resource.msg('global.home', 'common', null),
        url: URLUtils.url('Home-Show')
    });
    
    return allBreadcrumbs;
}

/**
 * Renders the Product Details Page
 * @param {Object} querystring - query string parameters
 * @param {Object} reqPageMetaData - request pageMetaData object
 * @param {Object} usePageDesignerTemplates - wether to use the page designer version of the product detail templates, defaults to false
 * @returns {Object} contain information needed to render the product page
 */
base.showProductPage = function (querystring, reqPageMetaData) {
    var URLUtils = require('dw/web/URLUtils');
    var ProductFactory = require('*/cartridge/scripts/factories/product');
    var pageMetaHelper = require('*/cartridge/scripts/helpers/pageMetaHelper');

    var params = querystring;
    var product = ProductFactory.get(params);
    var addToCartUrl = URLUtils.url('Cart-AddProduct');
    var canonicalUrl = URLUtils.url('Product-Show', 'pid', product.id);
    var breadcrumbs = getAllBreadcrumbs(null, product.id, []).reverse();

    var template = 'product/productDetails';

    if (product.productType === 'bundle' && !product.template) {
        template = 'product/bundleDetails';
    } else if (product.productType === 'set' && !product.template) {
        template = 'product/setDetails';
    } else if (product.template) {
        template = product.template;
    }

    pageMetaHelper.setPageMetaData(reqPageMetaData, product);
    pageMetaHelper.setPageMetaTags(reqPageMetaData, product);
    var schemaData = require('*/cartridge/scripts/helpers/structuredDataHelper').getProductSchema(product);

    return {
        template: template,
        product: product,
        addToCartUrl: addToCartUrl,
        resources: base.getResources(),
        breadcrumbs: breadcrumbs,
        canonicalUrl: canonicalUrl,
        schemaData: schemaData
    };
};

base.getAllBreadcrumbs = getAllBreadcrumbs;
module.exports = base;
