import { observer } from "mobx-react-lite";

interface ButtonProps {
    value: string
    onClick: ()=>void
    className?: string
}

export const Button = observer(({value, onClick, className=''}: ButtonProps) => {
    return (
        <button className={'btn ' + className} onClick={()=>onClick()}>{value}</button>
    )
});