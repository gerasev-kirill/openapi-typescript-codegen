export const sort = (a: string|any, b: string|any): number => {
    if (a.typeName && !b.typeName){
        return -1;
    }
    if (b.typeName && !a.typeName){
        return 1;
    }
    const nameA = (a.typeName || a).toLowerCase();
    const nameB = (b.typeName || b).toLowerCase();
    return nameA.localeCompare(nameB, 'en');
};
