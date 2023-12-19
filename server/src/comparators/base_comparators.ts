import { deepEqual, isJson } from "../../../common/utils";

export class Comparator {
    compare(first: any, second: any): any {
        throw Error('method compare is virtual');
    }
}

export class JSONComparator extends Comparator {
    toJson(value: any) {
        if (typeof value === 'string') {
            return JSON.parse(value);
        }

        return value;
    }

    compare(first: any, second: any) {
        return deepEqual(this.toJson(first), this.toJson(second));
    }
}

export class StringComparator extends Comparator {
    compare(first: string, second: string) {
        return first === second;
    }
}

export class BodyComparator extends Comparator {
    jsonComparator = new JSONComparator();
    stringComparator = new StringComparator();


    compare(first: string, second: string) {
        if (isJson(first)) {
            console.log('is json')
            if (isJson(second)) {
                console.log('is json')
                return this.jsonComparator.compare(first, second);
            }

            return false;
        }

        return this.stringComparator.compare(first, second);
    }
}
