import {observable, action, makeObservable, autorun} from 'mobx'

export type Tab = {
    name: string
}

// export class AppStore {
//     tabs: Tab[] = [];

//     constructor(tabs: Tab) {
//         makeAutoObservable(this, {
//             tabs: observable,
//             addTab: action
//         })
//         // this.tabs = tabs || [];
//     }

//     addTab(tab: Tab) {
//         this.tabs.push(tab);
//     }
// };

// export const RootContext = createContext<Partial<AppStore>>({});

 class AppStore {
    // tabs = observable<Tab>([]);
    tabs: Tab[] = []

    constructor() {
        makeObservable(this, {
            tabs: observable,
            addTab: action
        });
        autorun(()=>console.log('update'))
    }

    addTab(tab: Tab) {
        this.tabs.push(tab);
        console.log(this.tabs.length)
    }
}

export const store = new AppStore();
