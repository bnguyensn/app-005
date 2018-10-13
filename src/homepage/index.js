/* eslint global-require: 0 */  // This is needed for the Hot Module Replacement bit

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import './index.css';

ReactDOM.render(<App />, document.getElementById('root'));

// Hot Module Replacement
if (module.hot) {
    module.hot.accept('./App.js', () => {
        console.log("webpack's Hot Module Replacement: accepting the updated module.");
        const Next = require('./App.js');
        ReactDOM.render(<Next />, document.getElementById('root'));
    });
}
