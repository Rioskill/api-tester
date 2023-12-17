import './styles/App.scss';
import { observer } from 'mobx-react-lite';

import Exlorer from './components/Explorer';
import Editor from './components/Editor';
import { resize_store, store } from './stores/AppStore';
import { MouseEvent } from 'react';
import { Report } from './components/Report';
import { GroupSelector } from './components/GroupSelector';

const GroupEditor = observer(() => {
  return (
    <div className="body">
      <Exlorer/>
      <div id="resize" onMouseDown={()=>{resize_store.setMouseDown();}}></div>
    
      <div className="content">
        <div className="content__header col-10">
          {store.currentTab.name}
        </div>

        <button className="danger-btn col-2" onClick={()=>store.currentGroup.deleteCurrentTab()}>
          Удалить
        </button>
    
        <div className="content__element col-5">
          <div className="content__element__header">
            Редактор запроса
          </div>
          <div className="content__element__body padding">
            <Editor/>
          </div>
        </div>
    
        <div className="content__element col-7">
          <div className="content__element__header">
            Отчёт
          </div>
          <Report/>
        </div>
      </div>
    </div>
  )
})

export const App = observer(() => {
  const mouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if(resize_store.mouseDown) {
      resize_store.setContentX(e.screenX);
    }
  }

  const router = () => {
    if (store.routing.path === 'SELECTOR') {
      return (
        <GroupSelector/>
      )
    }

    return (
      <GroupEditor/>
    )
  }

  return (
    <div className="App" onMouseMove={mouseMove}
                         onMouseUp={()=>{resize_store.setMouseUp()}}
    >
      {
        router()
      }
    </div>
  )
})

export default App;
