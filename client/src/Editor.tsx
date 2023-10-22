import { observer } from "mobx-react-lite";
import { store } from "./stores/AppStore";

const Editor = observer(() => {
    return (
        <div className="editor">
            {store.currentTab}
        </div>
    )
});

export default Editor;
