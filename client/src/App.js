// Framework
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware, ConnectedRouter } from 'connected-react-router';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import formActionSaga from 'redux-form-saga';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { parse as parseQuery } from 'query-string';
import 'bootstrap';

// Components
import AccountEditPage from './components/AccountEditPage';
import AccountPage from './components/AccountPage';
import AccountsPage from './components/AccountsPage';
import DeployPage from './components/DeployPage';
import DeploymentsPage from './components/DeploymentsPage';
import DeploymentDetailsPage from './components/DeploymentDetailsPage';
import Header from './components/Header';
import HomePage from './components/HomePage';
import NamespacesPage from './components/NamespacesPage';
import NamespaceDetailsPage from './components/NamespaceDetailsPage';
import NamespaceEditPage from './components/NamespaceEditPage';
import NamespaceManagePage from './components/NamespaceManagePage';
import RegistriesPage from './components/RegistriesPage';
import ReleasesPage from './components/ReleasesPage';
import ServicesPage from './components/ServicesPage';
import ServiceDetailsPage from './components/ServiceDetailsPage';

// Reducers
import rootReducer from './modules';

import sagas from './sagas';

import { fetchAccountInfo } from './modules/account';

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
// require('bootstrap/dist/js/bootstrap.min.js');

const history = createBrowserHistory();
const initialState = {};

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  connectRouter(history)(rootReducer),
  initialState,
  composeWithDevTools(
    applyMiddleware(routerMiddleware(history), sagaMiddleware)
  )
);
sagaMiddleware.run(sagas);
sagaMiddleware.run(formActionSaga);

store.dispatch(fetchAccountInfo());

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div>
            <Header />
            <div className='container mt-1'>
              <Switch>
                <Route
                  exact
                  path='/registries'
                  render={() => <RegistriesPage /> }
                />
                <Route
                  exact
                  path='/namespaces'
                  render={() => <NamespacesPage /> }
                />
                <Route
                  exact
                  path='/namespaces/:namespaceId'
                  render={({ match }) =>
                    <NamespaceDetailsPage
                      namespaceId={match.params.namespaceId}
                    /> }
                />
                <Route
                  exact
                  path='/namespaces/:namespaceId/edit'
                  render={({ match }) =>
                    <NamespaceEditPage
                      namespaceId={match.params.namespaceId}
                    /> }
                />
                <Route
                  exact
                  path='/namespaces/:namespaceId/manage'
                  render={({ match }) =>
                    <NamespaceManagePage
                      namespaceId={match.params.namespaceId}
                    /> }
                />
                <Route
                  exact
                  path='/accounts'
                  render={() => <AccountsPage /> }
                />
                <Route
                  exact
                  path='/accounts/:accountId'
                  render={({ match }) =>
                    <AccountPage
                      accountId={match.params.accountId}
                    /> }
                />
                <Route
                  exact
                  path='/accounts/:accountId/edit'
                  render={({ match }) =>
                    <AccountEditPage
                      accountId={match.params.accountId}
                    /> }
                />
                <Route
                  exact
                  path='/releases'
                  render={() => <ReleasesPage /> }
                />
                <Route
                  exact
                  path='/deployments'
                  render={() => <DeploymentsPage /> }
                />
                <Route
                  exact
                  path='/deployments/:deploymentId'
                  render={({ match }) =>
                    <DeploymentDetailsPage
                      deploymentId={match.params.deploymentId}
                    />
                  }
                />
                <Route
                  exact
                  path='/services'
                  render={() => <ServicesPage /> }
                />
                <Route
                  exact
                  path='/services/:registry/:name'
                  render={({ match }) =>
                    <ServiceDetailsPage
                      registryName={match.params.registry}
                      serviceName={match.params.name}
                    />
                  }
                />
                <Route
                  exact
                  path='/deploy'
                  render={({ location }) => {
                    const parsedQueryString = parseQuery(location.search);
                    return <DeployPage parsedLocation={parsedQueryString} />;
                  }}
                />
                <Route
                  path='/'
                  render={() => <HomePage /> }
                />
              </Switch>
            </div>
          </div>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default App;
