import { observer } from "mobx-react-lite"

export const Labeled = observer((props: {label: string, children: React.ReactNode}) => {
    return (
        <div className="labeled">
            <label className="col-1">{props.label}</label>
            {props.children}
        </div>
    )
});
