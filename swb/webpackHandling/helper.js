const path = require('path');
const helper = require('../helper/helper');
let sfraBuilderConfig = process.env.npm_lifecycle_script.indexOf('testRunner') === -1 ? require(helper.getSfraBuilderConfig()) : require(helper.getSfraBuilderFixtureConfig());
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/**
 * Add task runners and plugins to ruleSet
 * @param {string} executingDir - DirName from which this script is originally executed to be the same as node_modules
 * @param {string} cartridge - Cartridge to compile
 * @param {boolean} env - Determine the mode of bundling
 * @param {string} fileType - File to add rulesets for
 * @returns {array} Rulesets for frontend compilation
 */
function buildRuleSet(executingDir, cartridge, env, fileType) {
  const sourcePath = path.resolve(executingDir, cartridge, 'cartridge/client');
  const ruleSet = [];
  if (fileType === 'js') {
    ruleSet.push({
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [[helper.getNodeModulesFolder(env, '@babel/preset-env'), { targets: sfraBuilderConfig.browserTargets ?? 'defaults' }]],
          plugins: [helper.getNodeModulesFolder(env, '@babel/plugin-proposal-object-rest-spread')],
          cacheDirectory: true
        }
      }
    });
  } else if (fileType === 'jsx') {
    ruleSet.push({
      test: /\.jsx$/,
      include: sourcePath,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: [helper.getNodeModulesFolder(env, '@babel/preset-env'), helper.getNodeModulesFolder(env, '@babel/preset-react')],
          plugins: [helper.getNodeModulesFolder(env, '@babel/plugin-proposal-object-rest-spread'), helper.getNodeModulesFolder(env, '@babel/plugin-proposal-class-properties')]
        }
      }
    });
    ruleSet.push({
      test: /\.(sa|sc|c)ss$/,
      use: [
        MiniCssExtractPlugin.loader,
        { loader: 'css-loader' },
        {
          loader: 'sass-loader',
          options: {
            sassOptions: {
              quietDeps: true
            }
          }
        }
      ]
    });
  } else if (fileType === 'scss') {
    // include all node_modules folder from each cartridge
    // this allows to reuse node_modules folder from other cartridges without the need
    // to directly install them in each cartridge
    let scssLoadPaths = [];
    sfraBuilderConfig.cartridges.forEach((includeCartridges) => {
      scssLoadPaths.push(path.resolve(includeCartridges.split('cartridges')[0], 'node_modules'));
      scssLoadPaths.push(path.resolve(includeCartridges.split('cartridges')[0], 'node_modules/flag-icon-css/sass'));
    });
    scssLoadPaths.push(path.resolve(executingDir, 'node_modules'));
    scssLoadPaths.push(path.resolve(executingDir, 'node_modules/flag-icon-css/sass'));
    if (sfraBuilderConfig.includeConfig && sfraBuilderConfig.includeConfig[cartridge] && sfraBuilderConfig.includeConfig[cartridge].scss) {
      scssLoadPaths.push.apply(
        scssLoadPaths,
        sfraBuilderConfig.includeConfig[cartridge].scss.map((loadPath) => path.resolve(executingDir, loadPath))
      );
    }
    ruleSet.push({
      test: /\.(sa|sc|c)ss$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            url: false,
            sourceMap: env.dev === true
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: ['autoprefixer']
            }
          }
        },
        {
          loader: 'css-unicode-loader' // Convert double-byte character to unicode encoding. Related to https://github.com/sass/dart-sass/issues/568
        },
        {
          loader: 'sass-loader',
          options: {
            sassOptions: {
              quietDeps: true, // TODO: This will brake in sass-loaded 3.0.0. for now only to not show tons of warnings in bootstrap 4.6.2. Bootstrap needs to be migrated to v5+
              // silenceDeprecations: ['import', 'global-builtin'], // TODO: This will brake in sass-loaded 3.0.0.
              loadPaths: scssLoadPaths,
              minimize: env.dev === false
            },
            sourceMap: env.dev === true
          }
        }
      ]
    });
  }
  return ruleSet;
}

module.exports = {
  buildRuleSet
};
