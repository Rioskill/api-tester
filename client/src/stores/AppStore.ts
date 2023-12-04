import {observable, action, makeObservable, autorun, computed} from 'mobx'
import { ParamTable } from './ParamTable'

export type HTTPMethod = 'GET' | 'POST'
export type RequestBodyType = 'JSON' | 'string'

interface ReportParams {
    id?: number,
    name: string,
    url: string,
    request: any,
    comparison_result: any
}

export class TestReport {
    id?: number = undefined
    name: string = ''
    url: string = ''
    request: any = {}
    comparison_result: any = {}

    constructor(props?: ReportParams) {
        this.id = props?.id;
        if (props) {
            this.name = props.name;
            this.url = props.url;
            this.request = props.request;
            this.comparison_result = props.comparison_result;
        }

        makeObservable(this, {
            name: observable,
            url: observable,
            request: observable,
            comparison_result: observable
        })
    }
}

interface TabParams {
    id?: number,
    name?: string,
    url?: string,
    method?: HTTPMethod,
    reports?: TestReport[]
}

export class Tab {
    name: string = ''

    inEditing: boolean = false

    url: string = ''
    method: HTTPMethod = 'GET'

    requestParams: ParamTable
    requestBody: string = ''
    requestBodyType: RequestBodyType = 'string'

    responseStatus: number = 200;
    responseBody: string = '';

    reports: TestReport[] = []
    current_report_id?: number = undefined

    constructor(props?: TabParams) {
        this.name = props?.name || '';
        this.url = props?.url || '';
        this.method = props?.method || 'GET';
        this.requestParams = new ParamTable();
        this.requestBody = '';
        this.reports = props?.reports || [];

        makeObservable(this, {
            name: observable,
            inEditing: observable,
            url: observable,
            method: observable,
            requestParams: observable,
            requestBody: observable,
            requestBodyType: observable,
            responseStatus: observable,
            responseBody: observable,
            reports: observable,
            current_report_id: observable,
            setUrl: action,
            setName: action,
            setMethod: action,
            setRequestBody: action,
            setRequestBodyType: action,
            setResponseStatus: action,
            setResponseBody: action,
            setInEditing: action,
            setReports: action
        })
    }

    setUrl(url: string) {
        this.url = url;
    }

    setName(name: string) {
        this.name = name;
    }

    setMethod(method: HTTPMethod) {
        this.method = method;
    }

    setRequestBody(value: string) {
        this.requestBody = value;
    }

    setRequestBodyType(type: RequestBodyType) {
        this.requestBodyType = type;
    }

    setResponseStatus(value: number) {
        this.responseStatus = value;
    }

    setResponseBody(value: string) {
        this.responseBody = value;
    }

    setInEditing(value: boolean) {
        this.inEditing = value;
    }

    setReports(reports: TestReport[]) {
        this.reports = reports;
    }

    addReport(report: TestReport) {
        this.reports.push(report);
    }

    setCurrentReportId(id: number) {
        this.current_report_id = id;
    }

    setCurrentReport(report: TestReport) {
        this.current_report_id = report.id;
    }

    get currentReport(): TestReport | undefined {
        if (this.current_report_id === undefined) {
            return undefined;
        }

        return this.reports[this.current_report_id];
    }
}

class AppStore {
    tabs: Tab[] = []
    currentTabId: number | undefined = undefined

    constructor() {
        makeObservable(this, {
            tabs: observable,
            currentTabId: observable,
            currentTab: computed,
            addTab: action,
            setCurrentTabId: action,
        });
    }

    addTab(tab: Tab | TabParams) {
        if (tab instanceof Tab) {
            this.tabs.push(tab);
        } else {
            this.tabs.push(new Tab(tab));
        }

        this.currentTabId = this.tabs.length - 1;
    }

    setCurrentTabId(id: number) {
        this.currentTabId = id;
    }

    get currentTab(): Tab {
        if (this.currentTabId === undefined) {
            return new Tab();
        }

        return this.tabs[this.currentTabId];
    }
}

class ResizeStore {
    contentX = 300;

    mouseDown = false;

    constructor() {
        makeObservable(this, {
            contentX: observable,
            mouseDown: observable,
            setContentX: action,
            explorerStyle: computed
        })
    }

    setContentX(x: number) {
        if (x > 200) {
            this.contentX = x;
        }
    }

    setMouseDown() {
        this.mouseDown = true;
    }

    setMouseUp() {
        this.mouseDown = false;
    }

    get explorerStyle() {
        console.log(this.contentX)
        return {width: `${this.contentX}px`}
    }
}

export const store = new AppStore();
export const resize_store = new ResizeStore();
