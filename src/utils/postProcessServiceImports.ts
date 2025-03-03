import type { Service } from '../client/interfaces/Service';
import { sort } from './sort';
import { unique } from './unique';

/**
 * Set unique imports, sorted by name
 * @param service
 */
export const postProcessServiceImports = (service: Service): Array<{typeName: string, path: string}|string> => {
    return service.imports.filter(unique).sort(sort);
};
