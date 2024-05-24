import type { Operation } from './Operation';

export interface Service {
    name: string;
    operations: Operation[];
    imports: Array<{typeName: string, path: string}|string>;
}
