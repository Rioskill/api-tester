import { observer } from "mobx-react-lite";
export const Button = observer(({ value, onClick }) => {
    return (<button onClick={() => onClick()}>{value}</button>);
});
