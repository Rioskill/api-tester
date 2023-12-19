import { Comparator } from "./comparators/base_comparators";
import { toJSON } from '../../common/utils' 
import { db_controller } from "./db_controller";

export type QueryParam = {key: string, value: string}
export type TesterParams = {
    test_id: number,
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

    async #makeRequest(test_id: number, url: string, method: string, params: QueryParam[]) {
        const paramStr = new URLSearchParams(this.transfromQueryParams(params));

        console.log(url + '?' + paramStr)

        const response = (await fetch(url + '?' + paramStr, {
            method: method
        }))

        const body = toJSON(await response.text())

        const id = await db_controller.saveReport(test_id, body, response.status)

        return {
            id, 
            status: response.status,
            body
        }
    }

    async makeTest({test_id, url, method, params, targetBody, targetStatus}: TesterParams) {
        const response = await this.#makeRequest(test_id, url, method, params);

        return {
            id: response.id,
            test_id: test_id,
            response,
            result: this.comparator.compare(
                    {
                        status: targetStatus,
                        body: toJSON(targetBody)
                    },
                    {
                        status: response.status,
                        body: response.body
                    }
                )
        };
    }

    async makeGroupTest(group_id: number) {
        const tests = await db_controller.getTests(group_id);

        const test_res = await Promise.all(tests.map(async (test: any) => await this.makeTest({
            test_id: test.id,
            url: test.target_url,
            method: test.method,
            params: test.params,
            targetBody: test.expected_response_body,
            targetStatus: test.expected_status
        })));

        return test_res;
    }
}
