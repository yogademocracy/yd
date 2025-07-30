'use strict';

var base = module.superModule;

/**
 * Renders the Product Details Page
 * @param {Object} querystring - query string parameters
 * @param {Object} reqPageMetaData - request pageMetaData object
 * @param {Object} usePageDesignerTemplates - wether to use the page designer version of the product detail templates, defaults to false
 * @returns {Object} contain information needed to render the product page
 */
function showProductPage(querystring, reqPageMetaData) {
    var URLUtils = require('dw/web/URLUtils');
    var ProductFactory = require('*/cartridge/scripts/factories/product');
    var pageMetaHelper = require('*/cartridge/scripts/helpers/pageMetaHelper');
    var Resource = require('dw/web/Resource');

    var params = querystring;
    var product = ProductFactory.get(params);
    var addToCartUrl = URLUtils.url('Cart-AddProduct');
    var canonicalUrl = URLUtils.url('Product-Show', 'pid', product.id);
    var homePageBreadcrumb = {
        htmlValue: Resource.msg('global.home', 'common', null),
        url: URLUtils.url('Home-Show')
    };
    var breadcrumbs = base.getAllBreadcrumbs(null, product.id, []);
    breadcrumbs.push(homePageBreadcrumb);
    breadcrumbs.reverse();

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
}

base.showProductPage = showProductPage;

module.exports = base;
