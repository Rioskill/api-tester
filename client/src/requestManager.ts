import { HTTPMethod, Tab } from "./stores/AppStore"
import { Param } from "./stores/ParamTable"

interface Request {
    params: Param[],
    body?: string
}

interface Response {
    status: number,
    body?: string
}

interface Test {
    name: string,
    method: HTTPMethod
    url: string

    request: Request
    response: Response
}

export const makeTestFromTab = (tab: Tab) => {
    return {
        name: tab.name,
        method: tab.method,
        url: tab.url,

        request: {
            params: tab.requestParams,
            body: tab.requestBody
        },

        response: {
            status: tab.responseStatus,
            body: tab.responseBody
        }
    }
}

export class RequestManager {
    server_url: string

    constructor(server_url: string) {
        this.server_url = server_url;
    }

    makeRequest(test: Tab | Test) {
        const makeTest = (test: Tab | Test) => {
            if (test instanceof Tab) {
                return makeTestFromTab(test);
            }

            return test;
        }

        const promise = fetch(this.server_url + '/api', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(makeTest(test))
        })

        promise.then(response => {
            response.json().then(json => console.log(json))
        })
    }
}

export const request_manager = new RequestManager('');
