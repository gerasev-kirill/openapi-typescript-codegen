import type { Model } from './Model';

export interface ModelComposition {
    type: 'one-of' | 'any-of' | 'all-of';
    imports: Array<{typeName: string, path: string}|string>;
    enums: Model[];
    properties: Model[];
}
