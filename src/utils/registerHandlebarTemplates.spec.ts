import { HttpClient } from '../HttpClient';
import { registerHandlebarTemplates } from './registerHandlebarTemplates';
import * as handlebars from 'handlebars'

function stringToHandlebars(template: string){
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

describe('registerHandlebarTemplates', () => {
    it('should return correct templates', () => {
        const templates = registerHandlebarTemplates({
            httpClient: HttpClient.FETCH,
            useOptions: false,
            useUnionTypes: false,
        });
        expect(templates.index).toBeDefined();
        expect(templates.exports.model).toBeDefined();
        expect(templates.exports.schema).toBeDefined();
        expect(templates.exports.service).toBeDefined();
        expect(templates.core.settings).toBeDefined();
        expect(templates.core.apiError).toBeDefined();
        expect(templates.core.apiRequestOptions).toBeDefined();
        expect(templates.core.apiResult).toBeDefined();
        expect(templates.core.request).toBeDefined();
    });
    it('should override hbs', () => {
        const templates = registerHandlebarTemplates({
            httpClient: HttpClient.FETCH,
            useOptions: false,
            useUnionTypes: false,
            hbsFilesOverride: {
                exportModel: stringToHandlebars("{{>header}}\n OVERRIDE")
            }
        });
        expect(templates.index).toBeDefined();
        expect(templates.exports.model).toBeDefined();
        expect(templates.exports.schema).toBeDefined();
        expect(templates.exports.service).toBeDefined();
        expect(templates.core.settings).toBeDefined();
        expect(templates.core.apiError).toBeDefined();
        expect(templates.core.apiRequestOptions).toBeDefined();
        expect(templates.core.apiResult).toBeDefined();
        expect(templates.core.request).toBeDefined();
    });
});
