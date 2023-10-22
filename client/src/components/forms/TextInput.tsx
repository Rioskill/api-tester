import { observer } from "mobx-react-lite";
import React, { ChangeEvent } from "react";

interface TextInputProps {
    value: string,
    onChange: (value: string)=>void
};

export const TextInput = observer(({value, onChange}: TextInputProps) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    }

    return (
        <input type="text" className="text-input" value={value} onChange={handleChange}/>
    )
});

