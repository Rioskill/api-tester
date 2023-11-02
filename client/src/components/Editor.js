import { observer } from "mobx-react-lite";
import { store } from "../stores/AppStore";
import { Labeled } from "./forms/Labeled";
import { Button } from "./forms/Button";
import { TextInput, TextArea, NumberInput } from "./forms/TextInput";
import { Selector } from "./forms/Selector";
import { EditableTable } from "./forms/EditableTable";
import { request_manager } from "../requestManager";
const Editor = observer(() => {
    const methods = ['GET', 'POST'];
    const bodyTypes = ['JSON', 'string'];
    // const [text, setText] = useState('');
    return (<div className="editor">
            <div className="editor__header">
                {store.currentTab.name}
            </div>

            <Labeled label="method">
                <Selector values={methods} selected={store.currentTab.method} onClick={(value) => store.currentTab.setMethod(value)}/>
            </Labeled>

            <Labeled label="url">
                <TextInput value={store.currentTab.url} onChange={(url) => {
            store.currentTab.setUrl(url);
        }}/>
            </Labeled>

            <EditableTable paramTable={store.currentTab.requestParams} keyName="Заголовок" valueName="Значение"/>

            <Labeled label="Request type">
                <Selector values={bodyTypes} selected={store.currentTab.requestBodyType} onClick={(value) => store.currentTab.setRequestBodyType(value)}/>
            </Labeled>
 
            <label>Request body:</label>
            <TextArea value={store.currentTab.requestBody} onChange={(body) => store.currentTab.setRequestBody(body)}/>

            <Labeled label="status">
                <NumberInput value={store.currentTab.responseStatus} onChange={(status) => store.currentTab.setResponseStatus(status)}/>
            </Labeled>

            <label>Response body:</label>
            <TextArea value={store.currentTab.responseBody} onChange={(body) => store.currentTab.setResponseBody(body)}/>

            <Button value="Тест" onClick={() => request_manager.makeRequest(store.currentTab)}/>
        </div>);
});
export default Editor;
