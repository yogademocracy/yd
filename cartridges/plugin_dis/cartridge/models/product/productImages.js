'use strict';

var collections = require('*/cartridge/scripts/util/collections');
var ProductImageDIS = require('*/cartridge/scripts/helpers/ProductImageDIS');

/**
 * @constructor
 * @classdesc Returns images for a given product
 * @param {dw.catalog.Product} product - product to return images for
 * @param {Object} imageConfig - configuration object with image types
 */
function Images(product, imageConfig) {
    imageConfig.types.forEach(function (type) {
        var result = {};
        if (imageConfig.quantity === 'single') {
            var firstImage = new ProductImageDIS(product, type);
            if (firstImage) {
                result = [{
                    alt: firstImage.getAlt(),
                    url: firstImage.getAbsURL().toString(),
                    title: firstImage.getTitle()
                }];
            }
        } else {
            var images = ProductImageDIS.getImages(product, type);

            result = collections.map(images, function (image, index) {
                return image.generateImageModel({ index: index });
            });
        }
        this[type] = result;
    }, this);
}

module.exports = Images;
