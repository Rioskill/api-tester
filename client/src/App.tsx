import './App.css';
import Exlorer from './Explorer';
import React from 'react';

import { observer } from 'mobx-react-lite';
import { action } from 'mobx';

// const store = new AppStore();

export const AppView = observer(({store}) => {
  // store.addTab({name: 'tab'})

  console.log('rerender')

  return (
      <div className="App">
      <header>
        header
      </header>
      <div className="body">
        <Exlorer tabs={store.tabs}/>
        <div className="editor">
          editor
          <button onClick={()=>store.addTab({name: 'tab'})}>
            add tab
          </button>
        </div>
      </div>
    </div>
  )
})

// function App() {
//   return <AppView store={store}/>
// }

// function App() {
  // const tabs = Array(10);
  // store.subscribe(()=>console.log('lol'))

  // const tabs = [1, 2, 3, 4]
  // console.log(tabs)

  // const appView = observer(({props}) => {
  //   <div className="App">
  //   <header>
  //     header
  //   </header>
  //   <div className="body">
  //     <Exlorer tabs={props.tabs}/>
  //     <div className="editor">
  //       editor
  //       <button onClick={()=>store.dispatch(addTab({name: 'tab'}))}>
  //         add tab
  //       </button>
  //     </div>
  //   </div>
  // </div>
  // })

  // return appView;

  // return (
  //   <div className="App">
  //     <header>
  //       header
  //     </header>
  //     <div className="body">
  //       <Exlorer tabs={tabs}/>
  //       <div className="editor">
  //         editor
  //         {/* <button onClick={()=>store.dispatch(addTab({name: 'tab'}))}>
  //           add tab
  //         </button> */}
  //       </div>
  //     </div>
  //   </div>
  // );
// }

// export default App;
