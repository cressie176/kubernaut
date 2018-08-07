import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import account from './account';
import accounts from './accounts';
import deploy from './deploy';
import deployment from './deployment';
import deployments from './deployments';
import editAccount from './editAccount';
import namespace from './namespace';
import namespaceEdit from './namespaceEdit';
import namespaces from './namespaces';
import registries from './registries';
import releases from './releases';
import service from './service';
import services from './services';
import viewAccount from './viewAccount';

export default combineReducers({
  form: formReducer,
  account,
  accounts,
  deploy,
  deployment,
  deployments,
  editAccount,
  namespace,
  namespaceEdit,
  namespaces,
  registries,
  releases,
  service,
  services,
  viewAccount,
});
