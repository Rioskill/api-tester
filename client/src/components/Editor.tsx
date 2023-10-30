import { observer } from "mobx-react-lite";
import { HTTPMethod, store } from "../stores/AppStore";
import { useState } from "react";

import { Labeled } from "./forms/Labeled";
import { Button } from "./forms/Button";
import { TextInput, TextArea, NumberInput } from "./forms/TextInput";
import { MethodSelector } from "./forms/MethodSelector";
import { EditableTable } from "./forms/EditableTable";
import { request_manager } from "../requestManager";

const Editor = observer(() => {
    const methods: HTTPMethod[] = ['GET', 'POST'];

    // const [text, setText] = useState('');

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

            <EditableTable paramTable={store.currentTab.requestParams}
                           keyName="Заголовок"
                           valueName="Значение"
            />
 
            <label>Request body:</label>
            <TextArea value={store.currentTab.requestBody} onChange={(body) => store.currentTab.setRequestBody(body)}/>

            <Labeled label="status">
                <NumberInput value={store.currentTab.responseStatus} onChange={(status) => store.currentTab.setResponseStatus(status)}/>
            </Labeled>

            <label>Response body:</label>
            <TextArea value={store.currentTab.responseBody} onChange={(body) => store.currentTab.setResponseBody(body)}/>

            <Button value="Тест" onClick={()=>request_manager.makeRequest(store.currentTab)}/>
        </div>
    )
});

export default Editor;
