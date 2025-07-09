'use strict';

const path = require('path');

/**
 * Allows to configure aliases for you require loading
 */
module.exports.aliasConfig = {
    // enter all aliases to configure

    alias: {
        base: path.resolve(
            process.cwd(),
            'cartridges/app_storefront_base/cartridge/client/default/'
        ),
        core: path.resolve(
            process.cwd(),
            'cartridges/app_yd_core/cartridge/client/default'
        ),
        gtm: path.resolve(
            process.cwd(),
            'cartridges/plugin_gtm/cartridge/client/default/'
        )
    }
};

/**
 * Allows excluding js files for compile
 */
module.exports.excludeJS = {
    'cartridges/app_storefront_base': ['eslint.config.js']
};

/**
 * Exposes cartridges included in the project
 */
module.exports.cartridges = [
    'cartridges/app_storefront_base',
    'cartridges/app_yd_core',
    'cartridges/app_yd_b2c'
];

/**
 * Lint options
 */
module.exports.lintConfig = {
    eslintFix: true,
    stylelintFix: true
};
