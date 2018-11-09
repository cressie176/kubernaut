import { createAction, handleActions, combineActions } from 'redux-actions';
import {
  createFilterActions,
  createFilterSelectors,
  createDefaultFilterState,
  createFilterReducers,
} from './lib/filter';
const actionsPrefix = 'KUBERNAUT/SERVICES';
const filterActions = createFilterActions(actionsPrefix);
export const initServicesPage = createAction(`${actionsPrefix}/INITIALISE`);
export const fetchServices = createAction(`${actionsPrefix}/FETCH_SERVICES`);
export const fetchServicesPagination = createAction(`${actionsPrefix}/FETCH_SERVICES_PAGINATION`);
export const toggleSort = createAction(`${actionsPrefix}/TOGGLE_SORT`);
export const setSort = createAction(`${actionsPrefix}/SET_SORT`);
export const setPagination = createAction(`${actionsPrefix}/SET_PAGINATION`);
export const FETCH_SERVICES_REQUEST = createAction(`${actionsPrefix}/FETCH_SERVICES_REQUEST`);
export const FETCH_SERVICES_SUCCESS = createAction(`${actionsPrefix}/FETCH_SERVICES_SUCCESS`);
export const FETCH_SERVICES_ERROR = createAction(`${actionsPrefix}/FETCH_SERVICES_ERROR`);
export const {
  addFilter,
  removeFilter,
  search,
  clearSearch,
  showFilters,
  hideFilters,
  setFilters,
  setSearch,
} = filterActions;

export const selectSortState = (state) => (state.services.sort);
export const selectPaginationState = (state) => (state.services.pagination);
export const {
  selectTableFilters,
  selectSearchFilter,
} = createFilterSelectors('services.filter');

const defaultFilterState = createDefaultFilterState({
  defaultColumn: 'name',
});
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
  sort: {
    column: 'name',
    order: 'asc',
  },
  pagination: {
    page: 1,
    limit: 50,
  },
  filter: defaultFilterState,
};

export default handleActions({
  [FETCH_SERVICES_REQUEST]: (state) => ({
    ...state,
    data: {
      ...defaultState.data,
    },
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
  [toggleSort]: (state, { payload }) => ({
    ...state,
    sort: {
      column: payload,
      order: state.sort.column === payload ? (state.sort.order === 'asc' ? 'desc' : 'asc') : 'asc',
    },
  }),
  [setSort]: (state, { payload = {} }) => ({
    ...state,
    sort: {
      column: payload.column || defaultState.sort.column,
      order: payload.order || defaultState.sort.order,
    },
  }),
  [combineActions(fetchServicesPagination, setPagination)]: (state, { payload }) => ({
    ...state,
    pagination: {
      page: payload.page || defaultState.pagination.page,
      limit: payload.limit || defaultState.pagination.limit,
    },
  }),
  ...createFilterReducers(filterActions, defaultFilterState),
}, defaultState);
