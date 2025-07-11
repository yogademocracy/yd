'use strict';

var server = require('server');

var cache = require('*/cartridge/scripts/middleware/cache');

server.get('GetCustomModal', server.middleware.https, cache.applyDefaultCache, function (req, res, next) {
    var Constants = require('*/cartridge/scripts/common/constants');

    var modalID = req.querystring.modalID;

    var params = req.querystring.params ? JSON.parse(req.querystring.params) : {};

    if (Constants.ALLOWED_CUSTOM_MODALS.indexOf(modalID) > -1) {
        res.render('components/modals/' + modalID, params);
    }

    return next();
});

module.exports = server.exports();
