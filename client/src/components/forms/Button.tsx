import { observer } from "mobx-react-lite";

interface ButtonProps {
    value: string
    onClick: ()=>void
}

export const Button = observer(({value, onClick}: ButtonProps) => {
    return (
        <button onClick={()=>onClick()}>{value}</button>
    )
});