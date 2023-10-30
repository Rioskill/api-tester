import { observer } from "mobx-react-lite";
import { ChangeEvent, Fragment } from "react";
import { ParamTable } from "../../stores/ParamTable";

type EditableTableProps = {
    paramTable: ParamTable,
    keyName: string,
    valueName: string
}
export const EditableTable = observer(({paramTable, keyName='Key', valueName='Value'}: EditableTableProps) => {
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

    const range = (i: number) => [...Array(i).keys()]

    return (
        <div className="params-table">
            <span>{keyName}</span>
            <span>{valueName}</span>

            {paramTable.params.map((param, i) => (
                <Fragment key={i}>
                    <input value={param.key} onChange={changeKey(i)}/>
                    <input value={param.value} onChange={changeValue(i)}/>
                </Fragment>
            ))}

            {
                range(paramTable.emptyRowsCnt).map((i) => 
                <Fragment key={i}>
                    <input value='' disabled={i !== 0} onChange={changeKey(paramTable.lastId)}/>
                    <input value='' disabled={i !== 0 || !paramTable.valueIsEditable(paramTable.lastId)} onChange={changeValue(paramTable.lastId)}/> 
                </Fragment>)
            }
        </div>
    )
})
