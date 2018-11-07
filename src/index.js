import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise';

import './App.css';

import SidebarPanel from './containers/SidebarPanel';
import reducers from './reducers';
import registerServiceWorker from './registerServiceWorker';

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware, promiseMiddleware)(createStore);

ReactDOM.render(
    <Provider store={createStoreWithMiddleware(reducers)}>
        <SidebarPanel />
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();
console.log('Env:::::::::::::: ', process.env.NODE_ENV)
if (process.env.NODE_ENV !== 'development') {
  window.Raven.config('https://cdb11d28460b4538b205fdeb7cf071ab@sentry.io/1208450', {
    release: '0-0-0',
    environment: 'development-test',
  }).install()

}