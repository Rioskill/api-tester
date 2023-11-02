import { Tab } from "./stores/AppStore";
export const makeTestFromTab = (tab) => {
    return {
        name: tab.name,
        method: tab.method,
        url: tab.url,
        request: {
            type: tab.requestBodyType,
            params: tab.requestParams.params,
            body: tab.requestBody
        },
        response: {
            status: tab.responseStatus,
            body: tab.responseBody
        }
    };
};
export class RequestManager {
    constructor(server_url) {
        this.server_url = server_url;
    }
    makeRequest(test) {
        const makeTest = (test) => {
            if (test instanceof Tab) {
                return makeTestFromTab(test);
            }
            return test;
        };
        const promise = fetch(this.server_url + '/api', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(makeTest(test))
        });
        promise.then(response => {
            response.json().then(json => console.log(json));
        });
    }
}
export const request_manager = new RequestManager('');
