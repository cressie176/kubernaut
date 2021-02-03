import { takeLatest, call, put, select } from 'redux-saga/effects';
import { SubmissionError } from 'redux-form';
import { push, getLocation } from 'connected-react-router';

import {
  extractFromQuery,
  alterQuery,
  makeQueryString,
  parseQueryString,
} from './lib/query';

import {
  initialiseAdminSecretsPage,
  fetchResults,
  fetchResultsPagination,
  FETCH_RESULTS_REQUEST,
  FETCH_RESULTS_SUCCESS,
  FETCH_RESULTS_ERROR,
  setPagination,
  setSearch,
  getFormValues,
  submitForm,
  selectPaginationState,
} from '../modules/adminSecrets';

import { getSecrets } from '../lib/api';

const pageUrl = '/admin/secrets';

export function* fetchResultsDataSaga({ payload = {} }) {
  const options = payload;
  const { page, limit } = yield select(selectPaginationState);
  const values = yield select(getFormValues);
  const offset = (page - 1) * limit;
  if (!values || !values.searchVal) return;

  yield put(FETCH_RESULTS_REQUEST());
  try {
    const data = yield call(getSecrets, { offset, limit, search: values.searchVal });
    yield put(FETCH_RESULTS_SUCCESS({ data }));
  } catch(error) {
    if (!options.quiet) console.error(error); // eslint-disable-line no-console
    yield put(FETCH_RESULTS_ERROR({ error: error.message }));
  }
}

export function* submitSaga() {
  try {
    const values = yield select(getFormValues);

    if (!values.searchVal) {
      yield put(submitForm.failure());
      return;
    }
    // yield call(saveCluster, values);
    yield put(submitForm.success());
    yield put(push(`${pageUrl}?${alterQuery(location.search, {
      search: values.searchVal,
      pagination: null,
    })}`));
    // yield put(fetchResults());
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    yield put(submitForm.failure(new SubmissionError({ _error: err.message || 'Something bad and unknown happened.' })));
  }
}

export function* paginationSaga() {
  const location = yield select(getLocation);
  const pagination = yield select(selectPaginationState);
  yield put(push(`${pageUrl}?${alterQuery(location.search, { pagination: makeQueryString({ ...pagination }) })}`));
}

export function* locationChangeSaga({ payload = {} }) {
  const { location } = payload;
  if (!location) return;

  const search = extractFromQuery(location.search, 'search') || '';
  const pagination = parseQueryString(extractFromQuery(location.search, 'pagination') || '');

  yield put(setSearch(search));
  yield put(setPagination(pagination));
  yield put(fetchResults());
}

export default [
  takeLatest(initialiseAdminSecretsPage, locationChangeSaga),
  takeLatest(fetchResults, fetchResultsDataSaga),
  takeLatest(fetchResultsPagination, paginationSaga),
  takeLatest(submitForm.REQUEST, submitSaga),
];
