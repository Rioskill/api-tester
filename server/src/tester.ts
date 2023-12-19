import { Comparator } from "./comparators/base_comparators";
import { toJSON } from '../../common/utils' 

export type QueryParam = {key: string, value: string}
export type TesterParams = {
    url: string,
    method: string,
    params: QueryParam[],
    targetBody: string,
    targetStatus: number
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

        const response = (await fetch(url + '?' + paramStr, {
            method: method
        }))

        return {
            status: response.status,
            body: toJSON(await response.text())
        }
    }

    async makeTest({url, method, params, targetBody, targetStatus}: TesterParams) {
        const response = await this.#makeRequest(url, method, params);

        return {
            response,
            result: this.comparator.compare(
                    {
                        status: targetStatus,
                        body: toJSON(targetBody)
                    },
                    response
                )
        };
    }
}
