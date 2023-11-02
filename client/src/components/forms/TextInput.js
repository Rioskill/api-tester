import { observer } from "mobx-react-lite";
import React from "react";
;
export const TextInput = observer(({ value, onChange }) => {
    const handleChange = (e) => {
        onChange(e.target.value);
    };
    return (<input type="text" className="text-input" value={value} onChange={handleChange}/>);
});
export const TextArea = observer(({ value, onChange }) => {
    const handleChange = (e) => {
        onChange(e.target.value);
    };
    return (<textarea value={value} className="textarea-input" onChange={handleChange}/>);
});
export const NumberInput = observer(({ value, onChange }) => {
    const handleChange = (e) => {
        const new_value = e.target.value;
        if (new_value === '') {
            onChange(0);
        }
        else {
            onChange(parseInt(new_value));
        }
    };
    return (<input type="number" className="number-input" value={value} onChange={handleChange}/>);
});
