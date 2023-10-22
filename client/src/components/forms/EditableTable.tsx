import { observer } from "mobx-react-lite";
import { ChangeEvent, Fragment } from "react";
import { ParamTable } from "../../stores/ParamTable";

export const EditableTable = observer(({paramTable}: {paramTable: ParamTable}) => {
    const changeKey = (id: number) => {
        return (e: ChangeEvent<HTMLInputElement>) => {
            paramTable.setKey(id, e.target.value);
        }
    }

    const changeValue = (id: number) => {
        return (e: ChangeEvent<HTMLInputElement>) => {
            paramTable.setValue(id, e.target.value);
        }
    }

    return (
        <div className="params-table">
            <span>Key</span>
            <span>Value</span>
            {paramTable.params.map((param, i) => (
                <Fragment key={i}>
                    <input value={param.key} onChange={changeKey(i)}/>
                    <input value={param.value} onChange={changeValue(i)}/>
                </Fragment>
            ))}
            {
                !paramTable.lastValueIsEditable && <>
                    <input value='' onChange={changeKey(paramTable.lastId)}/>
                    <input value='' onChange={changeValue(paramTable.lastId)}/> 
                </>
            }
        </div>
    )
})