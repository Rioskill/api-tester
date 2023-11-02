import { observable, action, makeObservable, computed } from 'mobx';
import { ParamTable } from './ParamTable';
export class Tab {
    constructor(props) {
        this.name = '';
        this.url = '';
        this.method = 'GET';
        this.requestBody = '';
        this.requestBodyType = 'string';
        this.responseStatus = 200;
        this.responseBody = '';
        this.name = (props === null || props === void 0 ? void 0 : props.name) || '';
        this.url = (props === null || props === void 0 ? void 0 : props.url) || '';
        this.method = (props === null || props === void 0 ? void 0 : props.method) || 'GET';
        this.requestParams = new ParamTable();
        this.requestBody = '';
        makeObservable(this, {
            name: observable,
            url: observable,
            method: observable,
            requestParams: observable,
            requestBody: observable,
            requestBodyType: observable,
            responseStatus: observable,
            responseBody: observable,
            setUrl: action,
            setMethod: action,
            setRequestBody: action,
            setRequestBodyType: action,
            setResponseStatus: action,
            setResponseBody: action
        });
    }
    setUrl(url) {
        this.url = url;
    }
    setMethod(method) {
        this.method = method;
    }
    setRequestBody(value) {
        this.requestBody = value;
    }
    setRequestBodyType(type) {
        this.requestBodyType = type;
    }
    setResponseStatus(value) {
        this.responseStatus = value;
    }
    setResponseBody(value) {
        this.responseBody = value;
    }
}
class AppStore {
    constructor() {
        this.tabs = [];
        this.currentTabId = undefined;
        makeObservable(this, {
            tabs: observable,
            currentTabId: observable,
            currentTab: computed,
            addTab: action,
            setCurrentTabId: action,
        });
    }
    addTab(tab) {
        if (tab instanceof Tab) {
            this.tabs.push(tab);
        }
        else {
            this.tabs.push(new Tab(tab));
        }
        this.currentTabId = this.tabs.length - 1;
    }
    setCurrentTabId(id) {
        this.currentTabId = id;
    }
    get currentTab() {
        if (this.currentTabId === undefined) {
            return new Tab();
        }
        return this.tabs[this.currentTabId];
    }
}
class ResizeStore {
    constructor() {
        this.editorX = 300;
        this.mouseDown = false;
        makeObservable(this, {
            editorX: observable,
            mouseDown: observable,
            setEditorX: action,
            explorerStyle: computed
        });
    }
    setEditorX(x) {
        if (x > 200) {
            this.editorX = x;
        }
    }
    setMouseDown() {
        this.mouseDown = true;
    }
    setMouseUp() {
        this.mouseDown = false;
    }
    get explorerStyle() {
        return { width: `${this.editorX}px` };
    }
}
export const store = new AppStore();
export const resize_store = new ResizeStore();
