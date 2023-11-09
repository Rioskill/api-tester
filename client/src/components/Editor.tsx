import { observer } from "mobx-react-lite";
import { HTTPMethod, RequestBodyType, store } from "../stores/AppStore";

import { Labeled } from "./forms/Labeled";
import { Button } from "./forms/Button";
import { TextInput, TextArea, NumberInput } from "./forms/TextInput";
import { Selector } from "./forms/Selector";
import { EditableTable } from "./forms/EditableTable";
import { request_manager } from "../requestManager";
import React from "react";

interface EditorTemplateProps {
    children: React.ReactNode[]
}

const EditorTemplate = observer(({children}: EditorTemplateProps)=>{
    return (
        <div className="editor">
            {
                children.map(child => {
                    if (React.isValidElement(child)) {
                        if (child.props.children) {
                            console.log(child.props.children)
                        }
                        if (child.props.children?.length === 1) {
                            const props = {...child.props, className: child.props.className + ' col-3'}
                            // child.props.className += ' col-2'
    
                            return React.cloneElement(child, props);
                        }
                    }

                    return child;
                })
            }
        </div>
    )
})

const Editor = observer(() => {
    const methods: HTTPMethod[] = ['GET', 'POST'];
    const bodyTypes: RequestBodyType[] = ['JSON', 'string'];

    return (
        <div className="editor">
            <Labeled label="method">
                <Selector values={methods} 
                          selected={store.currentTab.method}
                          onClick={(value)=>store.currentTab.setMethod(value as HTTPMethod)}
                />
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

            <Labeled label="Request type">
                <Selector values={bodyTypes} 
                          selected={store.currentTab.requestBodyType}
                          onClick={(value)=>store.currentTab.setRequestBodyType(value as RequestBodyType)}
                />
            </Labeled>
 
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
