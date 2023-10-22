import './App.scss';
import { observer } from 'mobx-react-lite';

import Exlorer from './components/Explorer';
import Editor from './components/Editor';

export const App = observer(() => {
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

export default App;