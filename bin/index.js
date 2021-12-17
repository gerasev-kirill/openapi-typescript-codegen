#!/usr/bin/env node

'use strict';

const path = require('path');
const program = require('commander');
const pkg = require('../package.json');
const fs = require('fs');
const handlebars = require('handlebars');

function filePathToHandlebars(filePath){
    if (!filePath){
        return
    }
    const template = fs.readFileSync(filePath, 'utf8').toString().trim();
    let prtemplate = handlebars.precompile(template, {
        strict: true,
        noEscape: false,
        preventIndent: true,
        knownHelpersOnly: true,
        knownHelpers: {
            equals: true,
            notEquals: true,
            containsSpaces: true,
            union: true,
            intersection: true,
            enumerator: true,
        },
    });
    let result;
    eval(`result = ${prtemplate};`);
    // @ts-ignore
    return result;
}

function isFileExists(filePath){
    try {
        return fs.existsSync(filePath)
    } catch (error) {
        return false
    }
}

const params = program
    .name('openapi')
    .usage('[options]')
    .version(pkg.version)
    .requiredOption('-i, --input <value>', 'OpenAPI specification, can be a path, url or string content (required)')
    .requiredOption('-o, --output <value>', 'Output directory (required)')
    .option('-c, --client <value>', 'HTTP client to generate [fetch, xhr, node, axios]', 'fetch')
    .option('--useOptions', 'Use options instead of arguments')
    .option('--useUnionTypes', 'Use union types instead of enums')
    .option('--exportCore <value>', 'Write core files to disk', true)
    .option('--exportServices <value>', 'Write services to disk', true)
    .option('--exportModels <value>', 'Write models to disk', true)
    .option('--exportSchemas <value>', 'Write schemas to disk', false)
    .option('--postfix <value>', 'Service name postfix', 'Service')
    .option('--request <value>', 'Path to custom request file')
    .option('--hbsOverrideModel <value>', 'Path to custom hbs file for model')
    .option('--hbsOverrideService <value>', 'Path to custom hbs file for service')
    .option('--hbsOverrideSchema <value>', 'Path to custom hbs file for schema')
    .option('--additionalContext <value>', 'Additional context for models, service and schema template files')
    .parse(process.argv)
    .opts();

const OpenAPI = require(path.resolve(__dirname, '../dist/index.js'));

if (OpenAPI) {
    let additionalContext = {};
    if (params.additionalContext){
        additionalContext = params.additionalContext;
        if (isFileExists(additionalContext)){
            additionalContext = fs.readFileSync(additionalContext);
        }
        try {
            additionalContext = JSON.parse(additionalContext)
        } catch (error) {
            console.error("Failed to parse additionalContext argument", error)
            additionalContext = {};
        }
    }
    OpenAPI.generate({
        input: params.input,
        output: params.output,
        httpClient: params.client,
        useOptions: params.useOptions,
        useUnionTypes: params.useUnionTypes,
        exportCore: JSON.parse(params.exportCore) === true,
        exportServices: JSON.parse(params.exportServices) === true,
        exportModels: JSON.parse(params.exportModels) === true,
        exportSchemas: JSON.parse(params.exportSchemas) === true,
        postfix: params.postfix,
        request: params.request,
        hbsFilesOverride: {
            exportModels: filePathToHandlebars(params.hbsOverrideModel),
            exportService: filePathToHandlebars(params.hbsOverrideService),
            exportSchema: filePathToHandlebars(params.hbsOverrideSchema),
        },
        additionalContext: additionalContext,
    })
        .then(() => {
            process.exit(0);
        })
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}
