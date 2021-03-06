import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import 'typeface-roboto';
import 'deque-pattern-library/dist/css/pattern-library.min.css';
import 'deque-pattern-library/dist/js/pattern-library.min.js';
import "@reach/skip-nav/styles.css";
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactGA.initialize('UA-7794756-10');
ReactGA.pageview(window.location.pathname + window.location.search);

if (process.env.NODE_ENV === 'development') {
  require('react-axe')(React, ReactDOM, 1000);
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
