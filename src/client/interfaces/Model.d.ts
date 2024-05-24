import type { Enum } from './Enum';
import type { Schema } from './Schema';

export interface Model extends Schema {
    name: string;
    isEmbedded?: boolean,
    isNodeModule?: boolean,
    filePath?: string,
    export: 'reference' | 'generic' | 'enum' | 'array' | 'dictionary' | 'interface' | 'one-of' | 'any-of' | 'all-of';
    type: string;
    base: string;
    template: string | null;
    link: Model | null;
    description: string | null;
    deprecated?: boolean;
    default?: string;
    imports: Array<{typeName: string, path: string, nodeModule?: boolean}|string>;
    enum: Enum[];
    enums: Model[];
    properties: Model[];
}
