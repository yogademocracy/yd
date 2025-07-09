'use strict';

var server = require('server');

server.extend(module.superModule);

var pageMetaData = require('*/cartridge/scripts/middleware/pageMetaData');

server.append('Start', pageMetaData.computedPageMetaData);

module.exports = server.exports();
