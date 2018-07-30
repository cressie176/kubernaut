import { all } from 'redux-saga/effects';

import accountSagas from './account';
import accountsSagas from './accounts';
import deploySagas from './deploy';
import deploymentSagas from './deployment';
import deploymentsSagas from './deployments';
import namespaceSagas from './namespace';
import namespaceEditSagas from './namespaceEdit';
import namespacesSagas from './namespaces';
import registriesSagas from './registries';
import releasesSagas from './releases';
import serviceSagas from './service';
import viewAccountSagas from './viewAccount';

export default function* rootSaga() {
  yield all([
    ...accountSagas,
    ...accountsSagas,
    ...deploySagas,
    ...deploymentSagas,
    ...deploymentsSagas,
    ...namespaceSagas,
    ...namespaceEditSagas,
    ...namespacesSagas,
    ...registriesSagas,
    ...releasesSagas,
    ...serviceSagas,
    ...viewAccountSagas,
  ]);
}