'use strict';

/**
 * @namespace Styleguide
 */

var server = require('server');

/**
 * Styleguide-Show : This end point will show rendered atlas styleguide static pages
 * /on/demandware.store/Sites-yoga-democracy-b2c-Site/en_US/Styleguide-Show
 */
server.get('Show', function (req, res, next) {
    var currentSite = require('dw/system/Site').current;

    res.render('_debug/styleguideShow', {
        siteName: currentSite.name
    });

    return next();
});

module.exports = server.exports();
