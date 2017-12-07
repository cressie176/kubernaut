import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import {
  fetchDeployments,
  FETCH_DEPLOYMENTS_REQUEST,
  FETCH_DEPLOYMENTS_SUCCESS,
  FETCH_DEPLOYMENTS_ERROR,
} from './deployment';

const mockStore = configureStore([thunk,]);

describe('Deployment Actions', () => {

  let actions;

  afterEach(() => {
    fetchMock.restore();
  });

  it('should fetch releases', async () => {

    fetchMock.mock('/api/deployments', [1, 2, 3,]);

    await dispatchDeploymentsActions();

    expectDeploymentsRequest();
    expectDeploymentsSuccess([1, 2, 3,]);
  });

  it('should tolerate errors fetching articles', async () => {

    fetchMock.mock('/api/deployments', 500, );

    await dispatchDeploymentsActions();

    expectDeploymentsError('/api/deployments returned 500 Internal Server Error');
  });

  it('should tolerate failures fetching articles', async () => {

    fetchMock.mock('/api/deployments', 403, );

    await dispatchDeploymentsActions();

    expectDeploymentsError('/api/deployments returned 403 Forbidden');
  });

  it('should timeout fetching article', async () => {

    fetchMock.mock('/api/deployments', {
      throws: new Error('simulate network timeout'),
    });

    await dispatchDeploymentsActions();

    expectDeploymentsError('simulate network timeout');
  });

  async function dispatchDeploymentsActions() {
    const store = mockStore({});
    const options = { quiet: true, };
    await store.dispatch(fetchDeployments(options));
    actions = store.getActions();
    expect(actions).toHaveLength(2);
  }

  function expectDeploymentsRequest() {
    expect(Object.keys(actions[0]).length).toBe(3);
    expect(actions[0].type).toBe(FETCH_DEPLOYMENTS_REQUEST);
    expect(actions[0].data).toMatchObject([]);
    expect(actions[0].loading).toBe(true);
  }

  function expectDeploymentsSuccess(releases) {
    expect(Object.keys(actions[1]).length).toBe(2);
    expect(actions[1].type).toBe(FETCH_DEPLOYMENTS_SUCCESS);
    expect(actions[1].data).toMatchObject(releases);
  }

  function expectDeploymentsError(msg) {
    expect(Object.keys(actions[1]).length).toBe(3);
    expect(actions[1].type).toBe(FETCH_DEPLOYMENTS_ERROR);
    expect(actions[1].data).toMatchObject([]);
    expect(actions[1].error.message).toBe(msg);
  }

});