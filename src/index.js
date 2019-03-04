import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './main/App';
import * as serviceWorker from './modules/auxliary/serviceWorker';
import { Provider } from 'mobx-react'
import Store from './main/store'


ReactDOM.render(
    <Provider {...Store}>
        <App />
    </Provider>,
    document.getElementById('root'));



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
