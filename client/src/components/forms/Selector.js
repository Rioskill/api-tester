import { observer } from "mobx-react-lite";
const MethodSelectorBtn = observer((props) => {
    const classes = "method-selector__button" + (props.isSelected ? " selected" : "");
    return (<button className={classes} onClick={props.onClick}>
            {props.value}
        </button>);
});
export const Selector = observer((props) => {
    return (<div className="method-selector">
            {props.values.map((value, i) => (<MethodSelectorBtn key={i} value={value} isSelected={value === props.selected} onClick={() => props.onClick(value)}/>))}
        </div>);
});
