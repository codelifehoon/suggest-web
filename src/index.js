import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import ReducerFunctions from './reduce/ReducerFunctions'
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import App from './App';


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




