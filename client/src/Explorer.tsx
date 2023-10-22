import { ChangeEvent, ReactEventHandler, SyntheticEvent, useState } from 'react';
import './App.scss';
import { observer } from 'mobx-react-lite';
import { store } from './stores/AppStore';

const Tab = observer((props: {name: string, tab_key: number}) => {
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
                props.tabs.map((tab, i) => <Tab key={i} tab_key={i} name={tab.name}></Tab>)
            }
        </div>
    )
});

const Exlorer = observer(() => {
    const [tabName, setName] = useState('');

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>)=>{
        setName(e.target.value.trim());
    }

    return (
        <div className="explorer">
            <ExplorerTabList tabs={store.tabs}/>

            <div className="explorer__tab-adder">
                <input type="text" className="explorer__tab-adder__input" value={tabName} onChange={handleNameChange}/>
                <button onClick={()=>store.addTab({name: tabName})}>
                    <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                        <line x1="20" y1="0" x2="20" y2="40" stroke="black"/>
                        <line x1="0" y1="20" x2="40" y2="20" stroke="black"/>
                    </svg>
                </button>
            </div>
        </div>
    )
});

export default Exlorer
