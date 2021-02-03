import { createAction, handleActions, combineActions } from 'redux-actions';
import { createFormAction } from 'redux-form-saga';
import {
  getFormValues as rfGetFormValues,
} from 'redux-form';

const actionsPrefix = 'KUBERNAUT/ADMIN_SECRETS';

export const initialiseAdminSecretsPage = createAction(`${actionsPrefix}/INITIALISE`);
export const fetchResults = createAction(`${actionsPrefix}/FETCH_RESULTS`);
export const fetchResultsPagination = createAction(`${actionsPrefix}/FETCH_RESULTS_PAGINATION`);
export const FETCH_RESULTS_REQUEST = createAction(`${actionsPrefix}/FETCH_RESULTS_REQUEST`);
export const FETCH_RESULTS_SUCCESS = createAction(`${actionsPrefix}/FETCH_RESULTS_SUCCESS`);
export const FETCH_RESULTS_ERROR = createAction(`${actionsPrefix}/FETCH_RESULTS_ERROR`);
export const setPagination = createAction(`${actionsPrefix}/SET_PAGINATION`);
export const setSearch = createAction(`${actionsPrefix}/SET_SEARCH`);


export const getFormValues = (state) => rfGetFormValues('adminSecrets')(state);
export const submitForm = createFormAction(`${actionsPrefix}/SUBMIT_FORM`);
export const selectPaginationState = (state) => (state.adminSecrets.pagination);


const defaultState = {
  data: {
    limit: 0,
    offset: 0,
    count: 0,
    pages: 0,
    page: 0,
    items: [],
  },
  meta: {},
  initialValues: {
    searchVal: '',
  },
  pagination: {
    page: 1,
    limit: 10,
  },
  newModalOpen: false,
};

export default handleActions({
  [initialiseAdminSecretsPage]: () => (defaultState),
  [FETCH_RESULTS_REQUEST]: (state) => ({
    ...state,
    data: {
      ...defaultState.data,
    },
    meta: {
      loading: true,
    },
  }),
  [FETCH_RESULTS_SUCCESS]: (state, { payload }) => ({
    ...state,
    data: payload.data,
    meta: {
      loading: false,
    },
  }),
  [FETCH_RESULTS_ERROR]: (state, { payload }) => ({
    ...state,
    meta: {
      error: payload.error,
      loading: false,
    },
  }),
  [combineActions(fetchResultsPagination, setPagination)]: (state, { payload }) => ({
    ...state,
    pagination: {
      page: payload.page || defaultState.pagination.page,
      limit: payload.limit || defaultState.pagination.limit,
    },
  }),
  [setSearch]: (state, { payload }) => ({
    ...state,
    initialValues: {
      ...state.initialValues,
      searchVal: payload,
    },
  }),
}, defaultState);
