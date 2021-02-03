import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Card,
  CardBody,
} from 'reactstrap';
import TablePagination from '../TablePagination';
import RenderInput from '../RenderInput';
import { AdminSubNav } from '../SubNavs';
import {
  AccountLink,
  NamespaceLink,
  SecretVersionLink,
  ServiceLink,
} from '../Links';
import Title from '../Title';

class AdminSecretsPage extends Component {

  render() {
    const {
      canAudit,
      hasClustersWrite,
      hasIngressAdminWrite,
      results,
      fetchResultsPagination,
      handleSubmit,
      submitForm,
      // error,
    } = this.props;

    return (
      <Row className="page-frame">
        <Col>
          <Title title="Secrets" />
          <AdminSubNav canAudit={canAudit} hasClustersWrite={hasClustersWrite} hasIngressAdminWrite={hasIngressAdminWrite} />

          <Row>
            <Col>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form inline>
                <FormGroup className="mb-sm-1">
                  <Field
                    name="searchVal"
                    component={RenderInput}
                    className="form-control"
                    autoComplete="off"
                    label="Search"
                    type="text"
                  />
                </FormGroup>
                <Button
                  color="dark"
                  type="submit"
                  onClick={handleSubmit(submitForm)}
                >Search</Button>
              </Form>
            </Col>
          </Row>

          <Row>
            <Col>
              {
                results.data.items.map(r => (
                  <Card className="mb-2">
                    <CardBody className="d-flex">
                      <div className="mr-4">
                        <SecretVersionLink secretVersion={r} />
                      </div>
                      <div className="mr-auto">
                        <ServiceLink service={r.service} />
                      </div>
                      <div className="mr-2">
                        <NamespaceLink namespace={r.namespace} pill />
                      </div>
                      <div className="">
                        Created by:
                        <AccountLink account={r.createdBy} />
                      </div>
                    </CardBody>
                  </Card>
                ))
              }
            </Col>
          </Row>

          <Row>
            <Col md="6">

              <TablePagination
                pages={results.data.pages}
                page={results.data.page}
                limit={results.data.limit}
                fetchContent={fetchResultsPagination}
              />
            </Col>
            <Col md="3"></Col>

          </Row>

        </Col>
      </Row>
    );
  }
}

AdminSecretsPage.propTypes = {

};

export default AdminSecretsPage;
