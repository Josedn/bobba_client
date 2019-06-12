import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import BobbaEnvironment from './bobba/BobbaEnvironment';

const win: any = window;
win.mainGame = BobbaEnvironment.getGame();

ReactDOM.render(<App />, document.getElementById('root'));