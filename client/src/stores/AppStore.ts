import {observable, action, makeObservable, autorun, computed} from 'mobx'
import { Param, ParamTable } from './ParamTable'
import { request_manager } from '../requestManager'

export type HTTPMethod = 'GET' | 'POST'
export type RequestBodyType = 'JSON' | 'string'

interface ReportParams {
    id?: number,
    name: string,
    url: string,
    request: any,
    comparison_result: any
    error?: string
}

export class TestReport {
    id?: number = undefined
    name: string = ''
    url: string = ''
    request: any = {}
    comparison_result: any = {}

    error?: string = undefined

    constructor(props?: ReportParams) {
        this.id = props?.id;
        if (props) {
            if (props.error === undefined) {
                this.name = props.name;
                this.url = props.url;
                this.request = props.request;
                this.comparison_result = props.comparison_result;
            } else {
                this.error = props.error;
                this.name = 'fail'
            }
        }

        makeObservable(this, {
            name: observable,
            url: observable,
            request: observable,
            comparison_result: observable
        })
    }
}

export interface TabParams {
    id?: number,
    name?: string,
    url?: string,
    method?: HTTPMethod,
    reports?: TestReport[],
    requestBody?: string,
    responseBody?: string,
    responseStatus?: number,
    requestParams?: Param[],
}

export class Tab {
    id: number = -1
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
        this.id = props?.id || -1;
        this.name = props?.name || '';
        this.url = props?.url || '';
        this.method = props?.method || 'GET';
        this.requestParams = new ParamTable();
        this.requestParams.setTab(this);
        this.requestBody = props?.requestBody || '';
        this.responseBody = props?.responseBody || '';
        this.responseStatus = props?.responseStatus || 200;
        this.reports = props?.reports || [];

        if (props?.requestParams) {
            this.requestParams.setParams(props.requestParams);
        }

        makeObservable(this, {
            id: observable,
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
            setId: action,
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

    updateTabInDb() {
        request_manager.updateTest(this);
    }

    setId (id: number) {
        this.id = id;
    }

    setUrl(url: string) {
        this.url = url;
        this.updateTabInDb();
    }

    setName(name: string) {
        this.name = name;
        this.updateTabInDb();
    }

    setMethod(method: HTTPMethod) {
        this.method = method;
        this.updateTabInDb();
    }

    setRequestBody(value: string) {
        this.requestBody = value;
        this.updateTabInDb();
    }

    setRequestBodyType(type: RequestBodyType) {
        this.requestBodyType = type;
    }

    setResponseStatus(value: number) {
        this.responseStatus = value;
        this.updateTabInDb();
    }

    setResponseBody(value: string) {
        this.responseBody = value;
        this.updateTabInDb();
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

    deleteReport(reportId: number) {
        const report = this.reports.splice(reportId, 1)[0];

        request_manager.deleteReport(report);

        if (this.reports.length === 0) {
            this.current_report_id = undefined;
        }
    }

    deleteCurrentReport() {
        if (this.current_report_id !== undefined) {
            this.deleteReport(this.current_report_id);
            this.current_report_id = undefined;
        }
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

interface GroupParams {
    id?: number,
    name?: string,
    tabs?: Tab[]
}

export class Group {
    id?: number = undefined
    name: string = "";
    tabs: Tab[] = []
    currentTabId: number | undefined = undefined

    constructor({id, name, tabs}: GroupParams) {
        this.id = id
        this.name = name || ''
        this.tabs = tabs || []

        makeObservable(this, {
            name: observable,
            tabs: observable,
            currentTabId: observable,
            currentTab: computed,
            addTab: action,
            deleteTab: action,
            deleteCurrentTab: action,
            setCurrentTabId: action
        });
    }

    updateGroupInDb() {
        request_manager.updateGroup(this);
    }

    setId(id: number) {
        this.id = id;
    }

    setName(name: string) {
        this.name = name;

        this.updateGroupInDb();
    }

    setTabs(tabs: TabParams[]) {
        this.tabs = tabs.map(tab => new Tab(tab));
        this.currentTabId = this.tabs.length - 1;
    }

    addTab(tab: Tab | TabParams) {
        if (tab instanceof Tab) {
            this.tabs.push(tab);
        } else {
            tab = new Tab(tab);
            this.tabs.push(tab);
        }

        this.currentTabId = this.tabs.length - 1;

        request_manager.createTest(this.id!, tab);
    }

    deleteTab(groupId: number) {
        const tab = this.tabs.splice(groupId, 1)[0];

        request_manager.deleteTest(tab);

        if (this.tabs.length === 0) {
            this.currentTabId = undefined;
        }
    }

    deleteCurrentTab() {
        if (this.currentTabId !== undefined) {
            this.deleteTab(this.currentTabId);
            this.currentTabId = undefined;
        }
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


    findTestById(test_id: number): Tab | undefined {
        return this.tabs.find(tab => tab.id === test_id);
    }
}

type RoutingPath = 'EDITOR' | 'SELECTOR'
class Routing {
    path: RoutingPath = 'SELECTOR';

    constructor(path?: RoutingPath) {
        if (path !== undefined) {
            this.path = path;
        }

        makeObservable(this, {
            path: observable,
            set: action
        })
    }

    set(path: RoutingPath) {
        this.path = path
    }
}

class AppStore {
    routing: Routing
    groups: Group[] = []
    currentGroupId: number | undefined = undefined

    constructor() {
        this.routing = new Routing()
        makeObservable(this, {
            routing: observable,
            groups: observable,
            currentGroupId: observable,
            currentGroup: computed,
            currentTab: computed,
            setGroups: action,
            addGroup: action,
            deleteGroup: action,
            deleteCurrentGroup: action,
            addTab: action,
            setCurrentGroupId: action,
            setCurrentTabId: action,
            goToEditor: action,
            returnToSelector: action
        });
    }

    setGroups(groups: GroupParams[]) {
        this.groups = groups.map(group => new Group(group))
    }

    addGroup(group: Group | string) {
        if (typeof group === 'string') {
            group = new Group({name: group})
            this.groups.push(group);
        } else {
            this.groups.push(group);
        }

        this.currentGroupId = this.groups.length - 1;

        request_manager.createGroup(group)
    }

    deleteGroup(groupId: number) {
        const group = this.groups.splice(groupId, 1)[0];

        request_manager.deleteGroup(group);

        if (this.groups.length === 0) {
            this.currentGroupId = undefined;
        }
    }

    deleteCurrentGroup() {
        if (this.currentGroupId !== undefined) {
            this.deleteGroup(this.currentGroupId);
            this.currentGroupId = undefined;
        }
    }

    findGroupById(group_id: number): Group | undefined {
        return this.groups.find(group => group.id === group_id);
    }

    addTab(tab: Tab | TabParams) {
        if (this.currentGroupId === undefined) {
            this.addGroup('основная')
        }
        this.currentGroup.addTab(tab);
    }

    setCurrentTabId(id: number) {
        this.currentGroup.setCurrentTabId(id);
    }

    setCurrentGroupId(id: number) {
        this.currentGroupId = id;
    }

    goToEditor() {
        this.routing.set('EDITOR');
    }

    returnToSelector() {
        this.routing.set('SELECTOR');
    }

    get currentGroup(): Group {
        if (this.currentGroupId === undefined) {
            return new Group({name: ''});
        }

        return this.groups[this.currentGroupId];
    }

    get currentTab(): Tab {
        return this.currentGroup.currentTab;
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
