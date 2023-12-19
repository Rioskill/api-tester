import { Group, HTTPMethod, Tab, TestReport, store } from "./stores/AppStore"
import { Param } from "./stores/ParamTable"

interface Request {
    params: Param[],
    body?: string
}

interface Response {
    status: number,
    body?: string,
}

interface Test {
    id: number
    name: string
    method: HTTPMethod
    url: string

    request: Request
    response: Response
}

export const makeTestFromTab = (tab: Tab) => {
    return {
        id: tab.id,
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
    }
}

export const readReport = (report: any) => {
    return {
        id: report.id,
        name: report.id.toString(),
        url: report.url,
        request: report.request,
        comparison_result: report.result
    }
}

export const readTest = (test: any) => {
    return {
        id: test.id,
        name: test.name,
        method: test.method,
        url: test.target_url,
        requestBody: test.request_body,
        responseBody: test.expected_response_body,
        responseStatus: test.expected_status,
        requestParams: test.params,
        reports: test.reports.map((report: any) => new TestReport(readReport(report)))
    }
}

export const readGroup = (group: {id: number, name: string, tests: any}) => {
    return {
        id: group.id,
        name: group.name,
        tabs: group.tests.map((test: any) => new Tab(readTest(test)))
    }
}

export class RequestManager {
    server_url: string

    constructor(server_url: string) {
        this.server_url = server_url;
    }

    insertGroups(groups: any[]) {
        const g = groups.map(group => readGroup(group));
        store.setGroups(g);
    }

    getTests() {
        const promise = fetch(this.server_url + '/groups', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        promise.then(response => {
            response.json().then(json => this.insertGroups(json));
        })
    }

    createTest(group_id: number, test: Tab) {
        const promise = fetch(this.server_url + `/group/${group_id}/tests/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: test.name
            })
        })

        promise.then(res => res.json().then(
            json => {
                console.log(json);
                test.setId(json.test_id)
            }
        ))
    }

    updateTest(test: Tab) {
        const promise = fetch(this.server_url + `/tests/${test.id}`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: test.name,
                method: test.method,
                target_url: test.url,
                request_body: test.requestBody,
                response_body: test.responseBody,
                status: test.responseStatus,
                params: test.requestParams.params
            })
        })
    }

    deleteTest(tab: Tab) {
        const promise = fetch(this.server_url + `/tests/${tab.id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }) 
    }

    createGroup(group: Group) {
        const promise = fetch(this.server_url + `/groups/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: group.name
            })
        })

        promise.then(res => res.json().then(
            json => {
                console.log(json, group);
                group.setId(json.group_id)
            }
        )) 
    }

    updateGroup(group: Group) {
        const promise = fetch(this.server_url + `/groups/${group.id}`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: group.name
            })
        })
    }

    deleteGroup(group: Group) {
        const promise = fetch(this.server_url + `/groups/${group.id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }) 
    }

    deleteReport(report: TestReport) {
        const promise = fetch(this.server_url + `/reports/${report.id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })  
    }

    readResponse = (json: any) => {
        if (json["error"] !== undefined) {
            const err = json["error"];
            let err_msg = ''

            if (err.code === "ConnectionRefused") {
                err_msg = `Не удалось отправить запрос на ${err.path}`;
            } else {
                err_msg = err.code;
            }

            store.currentTab.addReport(new TestReport({
                id: 0,
                name: 'fail',
                url: '',
                request: '',
                comparison_result: {},
                error: err_msg
            }))
        } else {
            store.currentTab.addReport(new TestReport({
                id: json.id,
                name: json.name || json.id,
                url: json.url,
                request: json.request,
                comparison_result: json.result
            }))
        }
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
            response.json().then(json => {
                console.log(json)

                this.readResponse(json);

                // if (json["error"] !== undefined) {
                //     const err = json["error"];
                //     let err_msg = ''

                //     if (err.code === "ConnectionRefused") {
                //         err_msg = `Не удалось отправить запрос на ${err.path}`;
                //     } else {
                //         err_msg = err.code;
                //     }

                //     store.currentTab.addReport(new TestReport({
                //         id: 0,
                //         name: '0',
                //         url: '',
                //         request: '',
                //         comparison_result: {},
                //         error: err_msg
                //     }))
                // } else {
                //     store.currentTab.addReport(new TestReport({
                //         id: json.id,
                //         name: json.name,
                //         url: json.url,
                //         request: json.request,
                //         comparison_result: json.result
                //     }))
                // }
            })
        })
    }

    makeGroupRequest(group: Group) {
        const promise = fetch(this.server_url + '/api/group', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: group.id})
        })

        promise.then(response => {
            response.json().then(json => {
                json.forEach((report: any) => {
                    // group.findTestById(report.test_id)?.addReport(new TestReport({
                    //     id: report.id,
                    //     name: report.id,
                    //     url: report.url,
                    //     request: report.request,
                    //     comparison_result: report.result
                    // }))
                    this.readResponse(report);
                })
            })
        })
    }
}

export const request_manager = new RequestManager('');
