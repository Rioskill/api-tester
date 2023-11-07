import { observer } from "mobx-react-lite";
import React, { ChangeEvent } from "react";

interface TextInputProps {
    value: string,
    onChange: (value: string)=>void
    className?: string
};

interface NumberInputProps {
    value: number
    onChange: (value: number)=>void
    className?: string
}

export const TextInput = observer(({value, onChange, className=''}: TextInputProps) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    }

    return (
        <input type="text" className={`text-input ${className}`} value={value} onChange={handleChange}/>
    )
});

export const TextArea = observer(({value, onChange, className=''}: TextInputProps) => {
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    return (
        <textarea value={value} className={`textarea-input ${className}`} onChange={handleChange}/>
    )
});

export const NumberInput = observer(({value, onChange, className=''}: NumberInputProps) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const new_value = e.target.value;

        if (new_value === '') {
            onChange(0);
        } else {
            onChange(parseInt(new_value));
        }
    }

    return (
        <input type="number"className={`number-input ${className}`} value={value} onChange={handleChange}/>
    )
})

