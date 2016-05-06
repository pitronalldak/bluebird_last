require('babel-polyfill');

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import routes from './routes';
import configureStore from './store/configureStore';
import './assets/css/bootstrap.min.css';
import './assets/css/core.css';
import './assets/css/icons.css';
import './assets/css/components.css';
import './assets/css/pages.css';
import './assets/css/menu.css';
import './assets/css/responsive.css';
import './assets/css/style.css';
import '../node_modules/react-select/dist/react-select.min.css';

const store = configureStore();

render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>, document.getElementById('app')
);
