import path from 'path';
import fs from 'fs';

import type { Model } from '../client/interfaces/Model';
import type { HttpClient } from '../HttpClient';
import type { Indent } from '../Indent';
import { writeFile } from './fileSystem';
import { formatCode as f } from './formatCode';
import { formatIndentation as i } from './formatIndentation';
import type { Templates } from './registerHandlebarTemplates';

/**
 * Generate Models using the Handlebar template and write to disk.
 * @param models Array of Models to write
 * @param templates The loaded handlebar templates
 * @param outputPath Directory to write the generated files to
 * @param httpClient The selected httpClient (fetch, xhr, node or axios)
 * @param useUnionTypes Use union types instead of enums
 * @param indent Indentation options (4, 2 or tab)
 */
export const writeClientModels = async (
    models: Model[],
    templates: Templates,
    outputPath: string,
    httpClient: HttpClient,
    useUnionTypes: boolean,
    indent: Indent,
    additionalContext?: Record<string, unknown>
): Promise<void> => {
    for (const model of models) {
        if (model.isNodeModule){
            continue;
        }
        const filePath = model.filePath || model.name;
        fs.mkdirSync(
            path.dirname(path.join(outputPath, filePath)), 
            { recursive: true }
        );
        if (model.isEmbedded){
            // нам нужно вычислять относительный импорт
            model.imports = model.imports.map((imp)=>{
                if (typeof imp === 'string'){
                    return imp
                }
                if (!imp.nodeModule){
                    imp.path = path.relative(path.dirname(filePath), imp.path)
                }
                return imp
            })
        }

        const file = path.resolve(outputPath, `${filePath}.ts`);
        const templateResult = templates.exports.model({
            ...model,
            httpClient,
            useUnionTypes,
            additionalContext: additionalContext || {},
        });
        await writeFile(file, i(f(templateResult), indent));
    }
};
