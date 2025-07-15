'use strict';

var processInclude = require('base/util');

// eslint-disable-next-line no-undef
$(document).ready(function () {
    processInclude(require('base/product/detail')); // TODO: core/product/detail
    processInclude(require('./product/detail'));
});
