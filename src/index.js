import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Provider} from "react-redux";
import store from './redux/store'

import {blockSub, connect as wsConnect, txSub} from "./redux/actions";
// connect on load
setTimeout(function () {
    store.dispatch(wsConnect(() => {
        store.dispatch(txSub());
        store.dispatch(blockSub());
    }));
}, 500);


ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
