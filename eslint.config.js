const globals = require('globals');
const js = require('@eslint/js');
const jsdoc = require('eslint-plugin-jsdoc');

module.exports = [
    {
        ignores: [
            'eslint.config.js',
            'swb/',
            'docs/',
            'cartridges/app_storefront_base/',
            'cartridges/bm_app_storefront_base/',
            'cartridges/int_avatax_sfra/',
            'cartridges/bm_avatax/',
            'cartridges/int_avatax_svcclient',
            'cartridges/int_cybs_sfra_base',
            'cartridges/int_cybs_sfra',
            'cartridges/modules/',
            'cartridges/*/cartridge/static/*/js/',
            'cartridges/*/cartridge/static/*/css/',
            'cartridges/*/cartridge/static/*/styleguide/',
            'cartridges/*/cartridge/static/*/experience/'
        ]
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.browser,
                ...globals.node,
                empty: true,
                dw: true,
                XML: true,
                request: true,
                response: true,
                session: true,
                customer: true,
                webreferences2: true,
                PIPELET_NEXT: true,
                PIPELET_ERROR: true,
                $: 'readonly',
                jQuery: 'readonly',
                globalThis: true,
                grecaptcha: true
            }
        },
        linterOptions: {
            reportUnusedDisableDirectives: 'off', // can be removed later
        },
        plugins: {
            js,
            jsdoc
        },
        rules: {
            'comma-dangle': ['error', 'never'],
            indent: ['error', 4, { SwitchCase: 1, VariableDeclarator: 1 }],
            'no-duplicate-imports': 'error',
            'global-require': 'off',
            'func-names': 'off',
            'no-undef': 'error',
            'no-unused-vars': ['error', { caughtErrors: 'none', varsIgnorePattern: '^err|^_' }],
            'max-len': 'off',
            'jsdoc/require-jsdoc': 'error',
            'jsdoc/check-tag-names': 'off',
            'no-use-before-define': [
                'error',
                {
                    functions: false,
                    classes: true,
                    variables: true,
                    allowNamedExports: true
                }
            ],
            'no-unused-expressions': ['error', { allowTernary: true }],
            'no-continue': 'off',
            'no-restricted-syntax': ['off', 'ForInStatement'],
            'vars-on-top': 'off',
            'multiline-ternary': ['error', 'always-multiline'],
            'space-infix-ops': 'error',
            'keyword-spacing': ['error', {
                before: true,
                after: true,
                overrides: {
                    return: { after: true },
                    throw: { after: true },
                    case: { after: true }
                }
            }],
            quotes: ['error', 'single', { avoidEscape: true }],
            'operator-linebreak': ['error', 'before'],
            'space-before-function-paren': ['error', {
                named: 'never',
                anonymous: 'always',
                asyncArrow: 'always'
            }],
            'semi': ['error', 'always']
        }
    }
];
