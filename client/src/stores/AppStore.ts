import {observable, action, makeObservable, autorun, computed} from 'mobx'

export type Tab = {
    name: string
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
        autorun(()=>console.log('update'))
    }

    addTab(tab: Tab) {
        this.tabs.push(tab);
        this.currentTabId = this.tabs.length - 1;
        console.log(this.tabs.length)
    }

    setCurrentTabId(id: number) {
        this.currentTabId = id;
    }

    get currentTab(): string {
        if (this.currentTabId === undefined) {
            return 'nothing';
        }

        return this.tabs[this.currentTabId].name;
    }
}

export const store = new AppStore();
