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
        ),
        cybersource: path.resolve(
            process.cwd(),
            'cartridges/int_cybs_sfra/cartridge/client/default/'
        ),
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
    'cartridges/int_cybs_sfra'
];

/**
 * Lint options
 */
module.exports.lintConfig = {
    eslintFix: true,
    stylelintFix: true
};

module.exports.copyConfig = {
    'cartridges/int_cybs_sfra': [
        {
            from: './cartridges/int_cybs_sfra/cartridge/client/default/custom/flexMicroform.js', 
            to: 'default/js/custom/flexMicroform.js'
        },
        {
            from: './cartridges/int_cybs_sfra/cartridge/client/default/custom/lib/jquery/jquery-3.7.1.min.js', 
            to: 'default/js/custom/lib/jquery-3.7.1.min.js'
        }
    ]
};

