'use strict';

const commandLineArgs = require('command-line-args');

/**
 * Specify what command line options are available and then
 * retrieve them
 */
const optionDefinitions = [
    {
        name: 'site',
        type: String,
        defaultOption: true,
        defaultValue: 'custom'
    },
    {
        name: 'watch',
        type: Boolean
    },
    {
        name: 'path',
        type: String
    },
    {
        name: 'dev',
        type: Boolean
    },
    {
        name: 'lib',
        type: String
    },
    {
        name: 'page',
        type: String
    },
    {
        name: 'folder',
        type: String
    },
    {
        name: 'content',
        type: String
    },
    {
        name: 'siteid',
        type: String
    },
    {
        name: 'remove',
        type: Boolean
    },
    {
        name: 'all',
        type: Boolean
    }
];

module.exports = commandLineArgs(optionDefinitions);
