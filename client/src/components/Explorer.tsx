import { MouseEvent, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Tab, store, resize_store } from '../stores/AppStore';
import { TextInput } from './forms/TextInput';

interface TabElementProps {
    name: string
    inEditing: boolean
    tab_key: number
}
const TabElement = observer(({name, inEditing, tab_key}: TabElementProps) => {
    if (!inEditing) {
        return (
            <div key={tab_key} className="tab" onClick={()=>{store.setCurrentTabId(tab_key)}}>
                {name}
            </div>
        )
    }

    const handleNameChange = (name: string) => {
        store.currentTab.setName(name);
    }

    return (
        <div className="tab">
            <TextInput value={name} onChange={handleNameChange}/>
        </div>
    )

});

const ExplorerTabList = observer((props: {tabs: any[]}) => {
    const isInEditing = (key: number) => {
        return store.currentTabId === key;
    }

    return (
        <div className="explorer__tab-list">
            {
                props.tabs.map((tab, i) => <TabElement key={i} tab_key={i} name={tab.name} inEditing={isInEditing(i)}></TabElement>)
            }
        </div>
    )
});

const Exlorer = observer(() => {
    const [tabName, setName] = useState('');

    const handleNameChange = (name: string) => {
        setName(name);
    }

    const addTab = (name: string) => {
        const tab = new Tab({name: name});
        store.addTab(tab);
        setName('');
    }

    return (
        <div className="explorer" style={resize_store.explorerStyle}>
            <div className="explorer__header">
                Requests
            </div>
            
            <ExplorerTabList tabs={store.tabs}/>

            <div className="explorer__tab-adder">
                <TextInput value={tabName} onChange={handleNameChange}/>
                <button className="explorer_tab-adder__btn" onClick={() => addTab(tabName)}>
                    <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                        <line x1="20" y1="0" x2="20" y2="40"/>
                        <line x1="0" y1="20" x2="40" y2="20"/>
                    </svg>
                </button>
            </div>

            {/* <div id="resize" onMouseMove={mouseMove}></div> */}
        </div>
    )
});

export default Exlorer
