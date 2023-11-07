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

    return (
        <div className="params-table">
            <span>{keyName}</span>
            <span>{valueName}</span>

            {paramTable.paramInput.map((param, i) => (
                <Fragment key={i}>
                    <input disabled={!param.key_editable} value={param.key} onChange={changeKey(i)}/>
                    <input disabled={!param.value_editable} value={param.value} onChange={changeValue(i)}/>
                </Fragment>
            ))}
        </div>
    )
})
