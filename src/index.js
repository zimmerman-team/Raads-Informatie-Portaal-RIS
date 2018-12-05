import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { PersistGate } from 'redux-persist/integration/react';
import configureStore from './store/configureStore';
import routes from './routes';
import '../node_modules/react-tippy/dist/tippy.css';

const config = configureStore();

ReactDOM.render(
  <Provider store={config.store}>
    <PersistGate loading={null} persistor={config.persistor}>
      <Router history={browserHistory}>{routes}</Router>
    </PersistGate>
  </Provider>,
  document.getElementById('root'),
);
