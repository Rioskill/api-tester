import { observer } from "mobx-react-lite";
import { Fragment } from "react";
export const EditableTable = observer(({ paramTable, keyName = 'Key', valueName = 'Value' }) => {
    const changeKey = (id) => {
        return (e) => {
            paramTable.setKey(id, e.target.value);
        };
    };
    const changeValue = (id) => {
        return (e) => {
            paramTable.setValue(id, e.target.value);
        };
    };
    const range = (i) => [...Array(i).keys()];
    return (<div className="params-table">
            <span>{keyName}</span>
            <span>{valueName}</span>

            {paramTable.params.map((param, i) => (<Fragment key={i}>
                    <input value={param.key} onChange={changeKey(i)}/>
                    <input value={param.value} onChange={changeValue(i)}/>
                </Fragment>))}

            {range(paramTable.emptyRowsCnt).map((i) => <Fragment key={i}>
                    <input value='' disabled={i !== 0} onChange={changeKey(paramTable.lastId)}/>
                    <input value='' disabled={i !== 0 || !paramTable.valueIsEditable(paramTable.lastId)} onChange={changeValue(paramTable.lastId)}/> 
                </Fragment>)}
        </div>);
});
