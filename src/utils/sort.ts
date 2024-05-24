export const sort = (a: string|any, b: string|any): number => {
    if (a.typeName){
        return -1;
    }
    const nameA = (a.typeName || a).toLowerCase();
    const nameB = (b.typeName || b).toLowerCase();
    return nameA.localeCompare(nameB, 'en');
};
