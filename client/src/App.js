// Framework
import React, { Component, } from 'react';
import { BrowserRouter as Router, Route, Switch, } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware, } from 'redux';
import thunk from 'redux-thunk';
import { Provider, } from 'react-redux';
import { composeWithDevTools, } from 'redux-devtools-extension';

// Components
import Header from './components/Header';
import ReleasesPage from './components/ReleasesPage';
import DeploymentsPage from './components/DeploymentsPage';
import HomePage from './components/HomePage';

// Reducers
import releases from './reducers/releases';
import deployments from './reducers/deployments';

// Styles
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Must be imported after bootstrap css

/***************************************************************
Using require and assigning jQuery to window to workaround the
following errors on npm start and npm test:

  1) 'Bootstrap's JavaScript requires jQuery' error
  2) Uncaught ReferenceError: define is not defined

***************************************************************/
window.jQuery = window.$ = require('jquery');
require('bootstrap/dist/js/bootstrap.min.js');

const initialState = {};

const store = createStore(combineReducers({
  releases,
  deployments,
}), initialState, composeWithDevTools(
  applyMiddleware(thunk)
));


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <Header />
            <div className='container'>
              <Switch>
                <Route exact path='/releases' render={() =>
                  <ReleasesPage />
                } />
                <Route exact path='/deployments' render={() =>
                  <DeploymentsPage />
                } />
                <Route path='/' render={() =>
                  <HomePage />
                } />
              </Switch>
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
