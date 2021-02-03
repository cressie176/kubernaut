import { connect } from 'react-redux';
import {
  reduxForm,
} from 'redux-form';
import AdminSecretsPage from './AdminSecretsPage';
import {
  fetchResultsPagination,
  submitForm,
} from '../../modules/adminSecrets';

function mapStateToProps(state, props) {
  const { account, adminSecrets } = state;

  return {
    results: {
      data: adminSecrets.data,
      meta: adminSecrets.meta,
    },
    submitForm,
    canAudit: account && account.permissions && account.permissions['audit-read'],
    hasClustersWrite: account && account.permissions && account.permissions['clusters-write'],
    hasIngressAdminWrite: account && account.permissions && account.permissions['ingress-admin'],
    initialValues: adminSecrets.initialValues,
  };
}

export default connect(mapStateToProps, {
  fetchResultsPagination,
})(reduxForm({
  form: 'adminSecrets',
  enableReinitialize: true,
  destroyOnUnmount: false,
})(AdminSecretsPage));
