import { observer } from "mobx-react-lite";
import { store } from "../stores/AppStore";
import { TextInput } from "./forms/TextInput";
import { useState } from "react";

interface GroupTabElementProps {
    name: string
    inEditing: boolean
    tab_key: number
  }
  const GroupTabElement = observer(({name, inEditing, tab_key}: GroupTabElementProps) => {
    if (!inEditing) {
        return (
            <div key={tab_key} className="tab" onClick={()=>{store.setCurrentGroupId(tab_key)}}>
                {name}
            </div>
        )
    }
  
    const handleNameChange = (name: string) => {
        store.currentGroup.setName(name);
    }
  
    return (
        <div className="tab">
            <TextInput value={name} onChange={handleNameChange}/>
        </div>
    )
});
  
const GroupTabList = observer((props: {tabs: any[]}) => {
    const isInEditing = (key: number) => {
        return store.currentGroupId === key;
    }
  
    return (
        <div className="explorer__tab-list">
            {
                props.tabs.map((tab, i) => <GroupTabElement key={i} tab_key={i} name={tab.name} inEditing={isInEditing(i)}></GroupTabElement>)
            }
        </div>
    )
  });
  
export const GroupSelector = observer(() => {
    const [tabName, setName] = useState('');
  
    const handleNameChange = (name: string) => {
        setName(name);
    }
  
    const addTab = (name: string) => {
        store.addGroup(name);
        setName('');
    }
  
    return (
        <div className="group-explorer-container">
            <div className="group-explorer">
                <GroupTabList tabs={store.groups}/>

                <div className="explorer__tab-adder">
                    <TextInput value={tabName} onChange={handleNameChange}/>
                    <button className="explorer_tab-adder__btn" onClick={() => addTab(tabName)}>
                        <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                            <line x1="20" y1="0" x2="20" y2="40"/>
                            <line x1="0" y1="20" x2="40" y2="20"/>
                        </svg>
                    </button>
                </div>

                <div className="group-explorer__btn-container">
                    <button className="danger-btn" onClick={()=>store.deleteCurrentGroup()}>
                        Удалить
                    </button>
                    <button className="btn" onClick={()=>store.goToEditor()}>
                        Выбрать
                    </button>
                </div>
            </div>
        </div>
    )
  }
)
