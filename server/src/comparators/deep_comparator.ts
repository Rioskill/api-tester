import { deepMerge, isEmpty, isObject } from "../utils";
import { JSONComparator } from "./base_comparators";

type DiffObj = {
    expected: any,
    found: any
}

type DiffObjFabric = (x: any, y: any)=>DiffObj;

export class JSONDeepComparator extends JSONComparator {
    diffObjFabric = (expected: any, found: any) => ({
        expected: expected,
        found: found
    })

    reverseDiffObjFabric = (expected: any, found: any) => this.diffObjFabric(found, expected);

    getDiff = (a: any, b: any, diffObjFabric: DiffObjFabric) => {
        let diff: any = {}
        for (const prop in a) {
            if (b.hasOwnProperty(prop)) {
                if (isObject(a[prop]) && isObject(b[prop])) {
                    const localDiff = this.getDiff(a[prop], b[prop], diffObjFabric);
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

    compare(first: any, second: any) {
        if (first === second) {
            return {}
        }
    
        if (typeof first !== 'object')
            return TypeError('x is not an object');
        if (first == null)
            return TypeError('x is null');
        if (typeof second !== 'object')
            return TypeError('y is not an object');
        if (second == null)
            return TypeError('y is null');
    
        return deepMerge(
                    this.getDiff(first, second, this.diffObjFabric), 
                    this.getDiff(second, first, this.reverseDiffObjFabric)
                );
    }
}
