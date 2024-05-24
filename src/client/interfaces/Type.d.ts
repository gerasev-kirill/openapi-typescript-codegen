export interface Type {
    type: string;
    base: string;
    template: string | null;
    imports: Array<{typeName: string, path: string, nodeModule?: boolean}|string>;
    isNullable: boolean;
}
