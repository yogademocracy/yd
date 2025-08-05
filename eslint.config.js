const globals = require('globals');
const js = require('@eslint/js');
const jsdoc = require('eslint-plugin-jsdoc');

module.exports = [
    {
        ignores: [
            'cartridges/*/cartridge/static/',

            'cartridges/app_storefront_base/',
            'cartridges/bm_app_storefront_base/',
            'cartridges/bm_avatax/',
            'cartridges/int_avatax_sfra/',
            'cartridges/int_avatax_svcclient',
            'cartridges/int_cybs_sfra',
            'cartridges/int_cybs_sfra_base',
            'cartridges/modules/',

            'bin/',
            'docs/',
            'node_modules/',
            'site_template/',
            'swb/'
        ]
    },
    js.configs.recommended,
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.browser,
                ...globals.node,
                $: false,
                dw: false,
                customer: false,
                session: false,
                request: false,
                response: false,
                empty: false,
                PIPELET_ERROR: false,
                PIPELET_NEXT: false,
                dataLayer: false,
                pageContext: false,
                device: false,
                picturefill: false,
                webreferences2: false,
                grecaptcha: false,
                globalThis: false
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
            'import/no-unresolved': 'off',
            indent: ['error', 4, {
                SwitchCase: 1,
                VariableDeclarator: 1,
                ignoredNodes: ['ConditionalExpression']
            }],
            'func-names': 'off',
            'jsdoc/require-jsdoc': 'error',
            'jsdoc/check-tag-names': 'off',
            'vars-on-top': 'off',
            'no-undef': 'error',
            'global-require': 'off',
            'no-shadow': ['error', { allow: ['err', 'callback'] }],
            'max-len': 'off',
            'no-param-reassign': [2, { props: false }],
            'no-restricted-syntax': ['off', 'ForInStatement'],
            'no-continue': 'off',
            'no-use-before-define': ['error', { functions: false, variables: true, classes: true }],
            'no-useless-escape': 'off',
            "no-unused-vars": ['error', {
                'argsIgnorePattern': '^_',
                'caughtErrorsIgnorePattern': '.'
            }],
            'semi': ['error', 'always'],
            'space-before-function-paren': ['error', {
                named: 'never',
                anonymous: 'always',
                asyncArrow: 'always'
            }],
            "spaced-comment": ["error", "always", {
                "exceptions": ["-"]
            }]
            // 'operator-linebreak': ['error', 'before'] // todo need to fix a lot of code
        }
    },
    {
        files: ['test/**/*.js'],
        rules: {
            'jsdoc/require-jsdoc': 'off',
            'no-undef': 'off',
            'no-unused-labels': 'off',
            'no-unused-vars': 'off'
        }
    }
];
