import './App.scss';
import { observer } from 'mobx-react-lite';

import Exlorer from './Explorer';
import Editor from './Editor';

export const AppView = observer(() => {
  return (
      <div className="App">
      <header>
        header
      </header>
      <div className="body">
        <Exlorer/>
        <Editor/>
      </div>
    </div>
  )
})

export default AppView;