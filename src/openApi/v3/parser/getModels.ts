import type { Model } from '../../../client/interfaces/Model';
import type { OpenApi } from '../interfaces/OpenApi';
import { getModel } from './getModel';
import { getType } from './getType';


function isObject(value: any): value is Record<string,any>{
    return value !== null && typeof value === 'object'
}



export const getModels = (openApi: OpenApi): Model[] => {
    if (!openApi.components) return [];

    const models: Model[] = [];
    function collectModel(definition: any, definitionName: string){
        if (definition.type){
            const definitionType = getType(definitionName);
            const model = getModel(openApi, definition, true, definitionType.base);
            if (isObject(definitionType.imports[0])){
                model.filePath = definitionType.imports[0]?.path;
            }
            model.isEmbedded = definitionName.includes('embedded') || 
                               definition.type === 'node_module';
            model.isNodeModule = definition.type === 'node_module';
            models.push(model);
            return
        }
        for(const key in definition){
            if (!isObject(definition[key])){
                continue
            }
            collectModel(definition[key], definitionName + '/' + key)
        }
    }


    for (const definitionName in openApi.components.schemas) {
        if (!openApi.components.schemas.hasOwnProperty(definitionName)) continue;
        collectModel(openApi.components.schemas[definitionName], definitionName);
        /*
        const definition = openApi.components.schemas[definitionName];
        const definitionType = getType(definitionName);
        const model = getModel(openApi, definition, true, definitionType.base);
        models.push(model);
        */
    }

    return models;
};
