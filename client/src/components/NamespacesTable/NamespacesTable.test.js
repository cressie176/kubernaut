import React from 'react';
import { shallow, } from 'enzyme';
import R from 'ramda';
import NamespacesTable from './NamespacesTable';
import { Human, Ago, } from '../DisplayDate';
import { AccountLink, NamespaceLink, } from '../Links';

describe('NamespacesTable', () => {

  it('should render table heading', () => {
    const wrapper = renderNamespacesTable();

    expect(wrapper.find('.namespaces-table__heading').exists()).toBe(true);
    expect(wrapper.find('.namespaces-table__heading__created-date').text()).toBe('Created');
    expect(wrapper.find('.namespaces-table__heading__namespace-name').text()).toBe('Name');
    expect(wrapper.find('.namespaces-table__heading__created-by').text()).toBe('Created By');
  });

  it('should render empty table', () => {
    const namespaces = { limit: 0, offset: 0, count: 0, pages: 10, currentPage: 1, items: [], };
    const wrapper = renderNamespacesTable({ namespaces, });

    expect(wrapper.find('.namespaces-table__body--empty').exists()).toBe(true);
    expect(wrapper.find('.namespaces-table__body__row').length).toBe(1);
    expect(wrapper.find('.namespaces-table__body__row').text()).toBe('There are no namespaces');
  });

  it('should render table with data', () => {
    const items = R.times((i) => {
      return {
        id: `namespace-${i+1}`,
        name: 'svc-ns',
        createdOn: new Date('2017-07-01T16:15:14.000Z'),
        createdBy: {
          id: '123',
          displayName: 'Roy Walker',
        },
      };
    }, 50);
    const namespaces = { limit: 50, offset: 0, count: items.length, pages: 10, currentPage: 1, items, };
    const wrapper = renderNamespacesTable({ namespaces, });

    expect(wrapper.find('.namespaces-table__body--data').exists()).toBe(true);
    expect(wrapper.find('.namespaces-table__body__row').length).toBe(50);
    const row = wrapper.find('.namespaces-table__body__row').at(0);

    expect(row.prop('id')).toBe('namespace-1');
    expect(row.find('.namespaces-table__body__row__created-date__on').find(Human).prop('date')).toBe(namespaces.items[0].createdOn);
    expect(row.find('.namespaces-table__body__row__created-date__ago').find(Ago).prop('date')).toBe(namespaces.items[0].createdOn);
    expect(row.find('.namespaces-table__body__row__namespace-name').find(NamespaceLink).prop('namespace')).toBe(namespaces.items[0]);
    expect(row.find('.namespaces-table__body__row__created-by').find(AccountLink).prop('account')).toBe(namespaces.items[0].createdBy);
  });

  it('should render table while loading', () => {

    const wrapper = renderNamespacesTable({ loading: true, });

    expect(wrapper.find('.namespaces-table__body--loading').exists()).toBe(true);
    expect(wrapper.find('.namespaces-table__body__row').length).toBe(1);
    expect(wrapper.find('.namespaces-table__body__row').text()).toBe('Loading namespaces…');
  });

  it('should render table with error', () => {

    const wrapper = renderNamespacesTable({ error: new Error(), });

    expect(wrapper.find('.namespaces-table__body--error').exists()).toBe(true);
    expect(wrapper.find('.namespaces-table__body__row').length).toBe(1);
    expect(wrapper.find('.namespaces-table__body__row').text()).toBe('Error loading namespaces');
  });


  function renderNamespacesTable(props) {
    return shallow(
      <NamespacesTable { ...props }  />
    );
  }

});
