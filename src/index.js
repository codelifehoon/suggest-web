import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import ReducerFunctions from './reduce/ReducerFunctions'
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import App from './App';
import * as  firebase from 'firebase'


if (!firebase.apps.length) {

    firebase.initializeApp({
        apiKey: "AIzaSyCalL1N8NvByA-gVG_6bfCnwgyBZXeNNiA",
        authDomain: "suggest-life.firebaseapp.com",
        databaseURL: "https://suggest-life.firebaseio.com",
        projectId: "suggest-life",
        storageBucket: "suggest-life.appspot.com",
        messagingSenderId: "130195882344"
    });

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




