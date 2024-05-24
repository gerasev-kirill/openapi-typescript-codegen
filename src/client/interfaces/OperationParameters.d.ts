import type { OperationParameter } from './OperationParameter';

export interface OperationParameters {
    imports: Array<{typeName: string, path: string}|string>;
    parameters: OperationParameter[];
    parametersPath: OperationParameter[];
    parametersQuery: OperationParameter[];
    parametersForm: OperationParameter[];
    parametersCookie: OperationParameter[];
    parametersHeader: OperationParameter[];
    parametersBody: OperationParameter | null;
}
