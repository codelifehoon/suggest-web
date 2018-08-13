import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import ReducerFunctions from './reduce/ReducerFunctions'
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import App from './App';
import * as  firebase from 'firebase'
import * as Config from "./product/util/Config";


if (!firebase.apps.length) {

    firebase.initializeApp(Config.FIREBASE_CONFIG);

}

const store = createStore(ReducerFunctions);
const appElement = document.getElementById('root');


ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    appElement
);



//ReactDOM.render(<App />, document.getElementById('root'));

registerServiceWorker();




