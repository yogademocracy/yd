'use strict';

module.exports = function (object, sizeChartId) {
    Object.defineProperty(object, 'sizeChartId', {
        enumerable: true,
        value: sizeChartId
    });

    Object.defineProperty(object, 'sizeChartModalParams', {
        enumerable: true,
        value: JSON.stringify({
            sizeChartId: sizeChartId,
            image: object.images.large[0].url,
            productName: object.productName
        })
    });
};
