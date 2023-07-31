export function MergeRecursive(obj1: any, obj2: any) {
    for (let prop in obj2) {
        try {
            if (obj2[prop].constructor == Object) {
                obj1[prop] = MergeRecursive(obj1[prop], obj2[prop]);
            } else {
                obj1[prop] = obj2[prop];
            }
        } catch (e) {
            obj1[prop] = obj2[prop];
        }
    }
    return obj1;
}