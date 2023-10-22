import {observable, action, makeObservable, autorun, computed} from 'mobx'
import { ParamTable } from './ParamTable'

export type HTTPMethod = 'GET' | 'POST'

interface TabParams {
    name?: string,
    url?: string,
    method?: HTTPMethod
}

export class Tab {
    name: string = ''

    url: string = ''
    method: HTTPMethod = 'GET'

    requestParams: ParamTable

    constructor(props?: TabParams) {
        this.name = props?.name || '';
        this.url = props?.url || '';
        this.method = props?.method || 'GET';
        this.requestParams = new ParamTable();

        makeObservable(this, {
            name: observable,
            url: observable,
            method: observable,
            requestParams: observable,
            setUrl: action,
            setMethod: action,
        })
    }

    setUrl(url: string) {
        this.url = url;
    }

    setMethod(method: HTTPMethod) {
        this.method = method;
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
    editorX = 300;

    mouseDown = false;

    constructor() {
        makeObservable(this, {
            editorX: observable,
            mouseDown: observable,
            setEditorX: action,
            explorerStyle: computed
        })
    }

    setEditorX(x: number) {
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
        return {width: `${this.editorX}px`}
    }
}

export const store = new AppStore();
export const resize_store = new ResizeStore();
