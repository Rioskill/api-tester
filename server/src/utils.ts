export const isJson = (str: string) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

const isEmpty = (obj: object) => {
    return Object.keys(obj).length === 0;
}

export const deepEqual = (x: any, y: any) => {
    if (x === y) {
        return true;
    } else if (typeof x === 'object' && x != null && typeof y === 'object' && y != null) {
        if (Object.keys(x).length != Object.keys(y).length) return false;

        for (const prop in x) {
            if (Object.hasOwnProperty.call(y, prop)) {
                if (!deepEqual(x[prop], y[prop])) return false;
            } else return false;
        }

        return true;
    } else return false;
}

export const deepCopy = (origin: any) => {
    if (typeof origin !== 'object' || origin === null) {
        return origin;
    }

    let res: any = {}

    for (const prop in origin) {
        if (typeof origin[prop] === 'object') {
            res[prop] = deepCopy(origin[prop]);
        } else {
            res[prop] = origin[prop];
        }
    }

    return res;
}

const isObject = (object: any) => {
    return typeof object === 'object' && object !== null;
}

export class MergeError extends Error {
    constructor(msg: string) {
        super(msg);
    }
}

export const deepMerge = (x: any, y: any) => {
    const getMerge = (a: any, b: any) => {
        let res: any = {}

        for (const prop in a) {
            if (b.hasOwnProperty(prop)) {
                if (isObject(a[prop])) {
                    if (!isObject(b[prop])) {
                        throw new MergeError(`merge collision: ${a[prop]} != ${b[prop]}`);
                    }

                    const localMerge = getMerge(a[prop], b[prop]);
                    res[prop] = localMerge;
                } else {
                    if (a[prop] != b[prop]) {
                        throw new MergeError(`merge collision: ${a[prop]} != ${b[prop]}`);
                    }
                    res[prop] = a[prop];
                }
            } else {
                res[prop] = deepCopy(a[prop]);
            }
        }

        for (const prop in b) {
            if (!res.hasOwnProperty(prop)) {
                res[prop] = deepCopy(b[prop]);
            }
        }

        return res
    }

    return getMerge(x, y);
}

type DiffObj = {
    expected: any,
    found: any
}

type DiffObjFabric = (x: any, y: any)=>DiffObj;

export const deepCompare = (x: any, y: any): any => {
    if (x === y) {
        return {}
    }

    if (typeof x !== 'object')
        return TypeError('x is not an object');
    if (x == null)
        return TypeError('x is null');
    if (typeof y !== 'object')
        return TypeError('y is not an object');
    if (y == null)
        return TypeError('y is null');

    const getDiff = (a: any, b: any, diffObjFabric: DiffObjFabric) => {
        let diff: any = {}
        for (const prop in a) {
            if (b.hasOwnProperty(prop)) {
                if (isObject(a[prop]) && isObject(b[prop])) {
                    const localDiff = getDiff(a[prop], b[prop], diffObjFabric);
                    if (!isEmpty(localDiff)) {
                        diff[prop] = localDiff;
                    }
                } else {
                    if (a[prop] !== b[prop]) {
                        diff[prop] = diffObjFabric(a[prop], b[prop])
                    }
                }
            } else {
                diff[prop] = diffObjFabric(a[prop], undefined)
            }
        }

        return diff;
    }

    const diffObjFabric = (expected: any, found: any) => ({
        expected: expected,
        found: found
    })

    const reverseDiffObjFabric = (expected: any, found: any) => diffObjFabric(found, expected);

    return deepMerge(getDiff(x, y, diffObjFabric), getDiff(y, x, reverseDiffObjFabric));
}
