'use strict';

var server = require('server');

server.extend(module.superModule);

var pageMetaData = require('*/cartridge/scripts/middleware/pageMetaData');

server.append('Start', function (req, res, next) {
    var viewData = res.getViewData();

    viewData.errorAction = viewData.action !== 'Error-Start' ? 'Error-404' : '';

    return next();
}, pageMetaData.computedPageMetaData);

module.exports = server.exports();
