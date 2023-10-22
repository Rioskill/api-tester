import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
// import { AppStore } from './stores/AppStore';
import { AppView } from './App';
import { store } from './stores/AppStore';
// import reportWebVitals from './reportWebVitals';

store.addTab({name: 'tab 1'})
store.addTab({name: 'tab 2'})
store.addTab({name: 'tab 3'})

const rootContainer = document.getElementById('root');

if (rootContainer === null) {
  console.log('no root element in html')
  // exit();
} else {
  const root = ReactDOM.createRoot(rootContainer);
  root.render(
    <React.StrictMode>
      <AppView store={store}/>
    </React.StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
