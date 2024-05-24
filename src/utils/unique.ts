export const unique = <T>(val: T, index: number, arr: T[]): boolean => {
    if (typeof val === 'object'){
        for (let i = 0; i < arr.length; i++) {
            if (JSON.stringify(val) === JSON.stringify(arr[i])){
                return i === index
            }
        }
        return true
    }
    return arr.indexOf(val) === index;
};
