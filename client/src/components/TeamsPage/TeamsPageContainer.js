import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import TeamsPage from './TeamsPage';
import {
  fetchTeamsPagination,
  fetchAccountsPagination,
  fetchServicesPagination,
  openModal,
  closeModal,
  submitForm,
  validateTeamName,
} from '../../modules/teams';

function mapStateToProps(state, props) {
  return {
    meta: state.teams.meta,
    teams: state.teams.teams,
    services: state.teams.services,
    accounts: state.teams.accounts,
    initialValues: state.teams.initialValues,
    newModalOpen: state.teams.newModalOpen,
    submitForm,
    canCreate: state.account.permissions['teams-write'],
  };
}

export default connect(mapStateToProps, {
  fetchTeamsPagination,
  fetchAccountsPagination,
  fetchServicesPagination,
  openModal,
  closeModal,
  validateTeamName,
})(reduxForm({
  form: 'newTeam',
  enableReinitialize: true,
  destroyOnUnmount: false,
})(TeamsPage));
