import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App';
// import { AppStore } from './stores/AppStore';
import { App } from './App';
import { TestReport, store } from './stores/AppStore';
// import reportWebVitals from './reportWebVitals';

const request = {
    params: {
        a: 3,
        b: 3
    }
}

for (let i = 1; i <= 100; i++) {
  store.addTab({
    name: `tab ${i}`,
    reports: [
      new TestReport({
        name: "not found report",
        url: "url",
        request: request,
        comparison_result: {
          status: {
            expected: 200,
            found: 404
         },
        body: {
          expected: {
            sum: 6
          },
          found: undefined
        },
        sum: 6
        }
      }),
      new TestReport({
        name: "good report",
        url: "new url",
        request: request,
        comparison_result: {
          status: 200,
          body: {
            sum: 6
          }
        }
      })
    ]
  })
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
