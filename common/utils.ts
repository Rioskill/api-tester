export const isJson = (str: string) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export const toJSON = (str: string) => {
    if (isJson(str)) {
        return JSON.parse(str);
    }

    return str;
}

export const range = (i: number) => [...Array(i).keys()]

export const isEmpty = (obj: object) => {
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

export const isObject = (object: any) => {
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

const detect = (word: string, origin: string) => {
    return origin.slice(-word.length) === word && [...origin.slice(0, word.length - 1)].every(el=>el==='!');
}

export const shieldWords = (words: string[], origin: string) => {
    for (const word of words) {
        if(detect(word, origin)) {
            return '!' + origin;
        }
    }

    return origin;
}

export const unShieldWords = (words: string[], origin: string) => {
    for (const word of words) {
        if (detect(word, origin)) {
            return origin.slice(1);
        }
    }

    return origin;
}

export const detectDiff = (obj: any) => {
    return obj.hasOwnProperty('expected') && obj.hasOwnProperty('found');
}

export const detectDiffR = (obj: any) => {
    const queue = []
    queue.push(obj)

    while (queue.length > 0) {
        const element = queue.shift();
        if (detectDiff(element)) {
            return false;
        }

        Object.entries(element).forEach(prop => queue.push(prop[1]));
    }

    return true;
}
