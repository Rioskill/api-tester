import './App.scss';
import { observer } from 'mobx-react-lite';

import Exlorer from './components/Explorer';
import Editor from './components/Editor';
import { resize_store } from './stores/AppStore';
import { MouseEvent } from 'react';

export const App = observer(() => {

  const mouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if(resize_store.mouseDown) {
      resize_store.setEditorX(e.screenX);
    }
  }
  return (
    <div className="App" onMouseMove={mouseMove}
                         onMouseUp={()=>{resize_store.setMouseUp()}}
    >
      <header>
        header
      </header>
      <div className="body">
        <Exlorer/>
        <div id="resize" onMouseDown={()=>{resize_store.setMouseDown();}}></div>
        <Editor/>
      </div>
    </div>
  )
})

export default App;
