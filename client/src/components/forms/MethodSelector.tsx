import { observer } from "mobx-react-lite"
import { HTTPMethod, store } from "../../stores/AppStore"

const MethodSelectorBtn = observer((props: 
        {
            method: string, 
            isSelected: boolean, 
            onClick: ()=>void,
        }) => {
    const classes = "method-selector__button" + (props.isSelected ? " selected" : "")

    return (
        <button className={classes} onClick={props.onClick}>
            {props.method}
        </button>
    )
})

export const MethodSelector = observer((props: {methods: HTTPMethod[], selectedMethod: HTTPMethod})=>{
    return (
        <div className="method-selector">
            {
                props.methods.map((method, i) => (
                    <MethodSelectorBtn
                        key={i}
                        method={method} 
                        isSelected={method === props.selectedMethod}
                        onClick={()=>store.currentTab.setMethod(method)}
                    />
                ))
            }
        </div>
    )
})