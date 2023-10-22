import {observable, action, makeObservable, autorun, computed} from 'mobx'

export type HTTPMethod = 'GET' | 'POST'

interface TabParams {
    name?: string,
    url?: string,
    method?: HTTPMethod
}

export type Param = {
    key: string,
    value: string
}

export class ParamTable {
    params: Param[] = []

    constructor() {
        makeObservable(this, {
            params: observable,
            setKey: action,
            setValue: action,
            lastValueIsEditable: computed,
            lastId: computed,
        });
    }

    setKey(id: number, key: string) {
        if (id === this.params.length) {
            this.params.push({
                key: '',
                value: ''
            })
        }
        this.params[id].key = key;
    }

    setValue(id: number, value: string) {
        this.params[id].value = value;
    }

    get lastValueIsEditable() {
        if (this.params.length === 0) {
            return false;
        }
        const lastId = this.params.length - 1;
        const lastParam = this.params[lastId]
        return lastParam.key !== '' && lastParam.value === '';
    }

    get lastId() {
        if (this.params.length === 0) {
            return 0;
        }
        if (this.lastValueIsEditable) {
            return this.params.length - 1;
        }
        return this.params.length;
    }
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

export const store = new AppStore();
