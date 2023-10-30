import { observer } from "mobx-react-lite";
import React, { ChangeEvent } from "react";

interface TextInputProps {
    value: string,
    onChange: (value: string)=>void
};

interface NumberInputProps {
    value: number,
    onChange: (value: number)=>void
}

export const TextInput = observer(({value, onChange}: TextInputProps) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    }

    return (
        <input type="text" className="text-input" value={value} onChange={handleChange}/>
    )
});

export const TextArea = observer(({value, onChange}: TextInputProps) => {
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    return (
        <textarea value={value} className="textarea-input" onChange={handleChange}/>
    )
});

export const NumberInput = observer(({value, onChange}: NumberInputProps) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const new_value = e.target.value;

        if (new_value === '') {
            onChange(0);
        } else {
            onChange(parseInt(new_value));
        }
    }

    return (
        <input type="number" className="number-input" value={value} onChange={handleChange}/>
    )
})

