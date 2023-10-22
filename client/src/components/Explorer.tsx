import { MouseEvent, useState } from 'react';
import '../App.scss';
import { observer } from 'mobx-react-lite';
import { Tab, store, resize_store } from '../stores/AppStore';
import { TextInput } from './forms/TextInput';

const TabElement = observer((props: {name: string, tab_key: number}) => {
    return (
        <div key={props.tab_key} className="tab" onClick={()=>{store.setCurrentTabId(props.tab_key)}}>
            {props.name}
        </div>
    )
});

const ExplorerTabList = observer((props: {tabs: any[]}) => {
    return (
        <div className="explorer__tab-list">
            {
                props.tabs.map((tab, i) => <TabElement key={i} tab_key={i} name={tab.name}></TabElement>)
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

    // const [width, setWidth] = useState('300px');

    // const mouseMove = (e: MouseEvent<HTMLDivElement>) => {
    //     setWidth(e.screenX + 'px')
    // }

    // const width = '100px'

    return (
        <div className="explorer" style={resize_store.explorerStyle}>
            <ExplorerTabList tabs={store.tabs}/>

            <div className="explorer__tab-adder">
                <TextInput value={tabName} onChange={handleNameChange}/>
                <button onClick={() => addTab(tabName)}>
                    <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                        <line x1="20" y1="0" x2="20" y2="40" stroke="black"/>
                        <line x1="0" y1="20" x2="40" y2="20" stroke="black"/>
                    </svg>
                </button>
            </div>

            {/* <div id="resize" onMouseMove={mouseMove}></div> */}
        </div>
    )
});

export default Exlorer
