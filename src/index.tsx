import React from 'react';
import ReactDOM from 'react-dom';
import App from './ui/components/App';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './ui/reducers';
import BobbaEnvironment from './bobba/BobbaEnvironment';

const win: any = window;
win.mainGame = BobbaEnvironment.getGame();

const store = createStore(rootReducer);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));