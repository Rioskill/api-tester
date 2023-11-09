import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App';
// import { AppStore } from './stores/AppStore';
import { App } from './App';
import { store } from './stores/AppStore';
// import reportWebVitals from './reportWebVitals';

for (let i = 1; i <= 100; i++) {
  store.addTab({name: `tab ${i}`})
}

const rootContainer = document.getElementById('root');

if (rootContainer === null) {
  console.log('no root element in html')
  // exit();
} else {
  const root = ReactDOM.createRoot(rootContainer);
  root.render(
    <React.StrictMode>
      <App/>
    </React.StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
