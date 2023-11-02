import { observer } from "mobx-react-lite"
import { HTTPMethod, store } from "../../stores/AppStore"

const MethodSelectorBtn = observer((props: 
        {
            value: string, 
            isSelected: boolean, 
            onClick: ()=>void,
        }) => {
    const classes = "method-selector__button" + (props.isSelected ? " selected" : "")

    return (
        <button className={classes} onClick={props.onClick}>
            {props.value}
        </button>
    )
})

export const Selector = observer((props: {values: string[], selected: string, onClick: (s: string)=>void})=>{
    return (
        <div className="method-selector">
            {
                props.values.map((value, i) => (
                    <MethodSelectorBtn
                        key={i}
                        value={value} 
                        isSelected={value === props.selected}
                        onClick={()=>props.onClick(value)}
                    />
                ))
            }
        </div>
    )
})