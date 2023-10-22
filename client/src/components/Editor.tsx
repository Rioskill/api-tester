import { observer } from "mobx-react-lite";
import { HTTPMethod, store } from "../stores/AppStore";

import { Labeled } from "./forms/Labeled";
import { TextInput } from "./forms/TextInput";
import { MethodSelector } from "./forms/MethodSelector";
import { EditableTable } from "./forms/EditableTable";

const Editor = observer(() => {
    const methods: HTTPMethod[] = ['GET', 'POST'];

    return (
        <div className="editor">
            <div className="editor__header">
                {store.currentTab.name}
            </div>

            <Labeled label="method">
                <MethodSelector methods={methods} selectedMethod={store.currentTab.method}/>
            </Labeled>

            <Labeled label="url">
                <TextInput value={store.currentTab.url} onChange={(url) => {
                    store.currentTab.setUrl(url)
                }}/>
            </Labeled>

            <EditableTable params={store.currentTab.requestParams.params}/>
        </div>
    )
});

export default Editor;
