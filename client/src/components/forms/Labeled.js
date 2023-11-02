import { observer } from "mobx-react-lite";
export const Labeled = observer((props) => {
    return (<div className="labeled">
            <label>{props.label}</label>
            {props.children}
        </div>);
});
