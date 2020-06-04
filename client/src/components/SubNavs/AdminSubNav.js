import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Nav, NavItem, NavLink } from 'reactstrap';
import {
  AdminSummaryLink,
  AuditLink,
} from '../Links';

class AdminSubNav extends Component {
  render() {
    const {
      canAudit
    } = this.props;


    return (
      <Row className="mb-1">
        <Col>
          <Nav tabs>
            <NavItem>
              <AdminSummaryLink container>
                <NavLink>Summary</NavLink>
              </AdminSummaryLink>
            </NavItem>
            {
              canAudit ?
              <NavItem>
                <AuditLink container>
                  <NavLink><i className="fa fa-user-secret" aria-hidden='true'></i> Audit</NavLink>
                </AuditLink>
              </NavItem>
              : null
            }

          </Nav>
        </Col>
      </Row>
    );
  }
}

AdminSubNav.propTypes = {
  canAudit: PropTypes.bool,
};

export default AdminSubNav;
