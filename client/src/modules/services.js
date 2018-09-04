import { createAction, handleActions } from 'redux-actions';
const actionsPrefix = 'KUBERNAUT/SERVICES';
export const fetchServicesPagination = createAction(`${actionsPrefix}/FETCH_SERVICES_PAGINATION`);
export const FETCH_SERVICES_REQUEST = createAction(`${actionsPrefix}/FETCH_SERVICES_REQUEST`);
export const FETCH_SERVICES_SUCCESS = createAction(`${actionsPrefix}/FETCH_SERVICES_SUCCESS`);
export const FETCH_SERVICES_ERROR = createAction(`${actionsPrefix}/FETCH_SERVICES_ERROR`);

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
};

export default handleActions({
  [FETCH_SERVICES_REQUEST]: () => ({
    ...defaultState,
    meta: {
      loading: true,
    },
  }),
  [FETCH_SERVICES_SUCCESS]: (state, { payload }) => ({
    ...state,
    data: payload.data,
    meta: {
      loading: false,
    },
  }),
  [FETCH_SERVICES_ERROR]: (state, { payload }) => ({
    ...state,
    meta: {
      error: payload.error,
      loading: false,
    },
  }),
}, defaultState);