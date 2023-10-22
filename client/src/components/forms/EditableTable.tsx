import { observer } from "mobx-react-lite";
import { ChangeEvent, Fragment } from "react";
import { Param, store } from "../../stores/AppStore";

export const EditableTable = observer((props: {params: Param[]}) => {
    const changeKey = (id: number) => {
        return (e: ChangeEvent<HTMLInputElement>) => {
            store.currentTab.requestParams.setKey(id, e.target.value);
        }
    }

    const changeValue = (id: number) => {
        return (e: ChangeEvent<HTMLInputElement>) => {
            store.currentTab.requestParams.setValue(id, e.target.value);
        }
    }

    return (
        <div className="params-table">
            <span>Key</span>
            <span>Value</span>
            {props.params.map((param, i) => (
                <Fragment key={i}>
                    <input value={param.key} onChange={changeKey(i)}/>
                    <input value={param.value} onChange={changeValue(i)}/>
                </Fragment>
            ))}
            {
                !store.currentTab.requestParams.lastValueIsEditable && <>
                    <input value='' onChange={changeKey(store.currentTab.requestParams.lastId)}/>
                    <input value='' onChange={changeValue(store.currentTab.requestParams.lastId)}/> 
                </>
            }
        </div>
    )
})