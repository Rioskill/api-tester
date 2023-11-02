import { Comparator } from "./comparators";

export type QueryParam = {key: string, value: string}
export type TesterParams = {
    url: string,
    method: string,
    params: QueryParam[],
    targetBody: string
}
export class Tester {
    comparator: Comparator;

    constructor(comparator: Comparator) {
        this.comparator = comparator;
    }

    transformQueryParam = (param: QueryParam) => [param.key, param.value];
    transfromQueryParams = (params: QueryParam[]) => Object.fromEntries(params.map(this.transformQueryParam));

    async #makeRequest(url: string, method: string, params: QueryParam[]) {
        const paramStr = new URLSearchParams(this.transfromQueryParams(params));

        console.log(url + '?' + paramStr)

        return (await fetch(url + '?' + paramStr, {
            method: method
        })).text()
    }

    async makeTest({url, method, params, targetBody}: TesterParams) {
        const response = await this.#makeRequest(url, method, params);

        return {
            response,
            result: this.comparator.compare(targetBody, response)
        };
    }
}
