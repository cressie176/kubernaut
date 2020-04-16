import React, { Component } from 'react';
import { Field, FieldArray } from 'redux-form';
// import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Card,
  CardHeader,
  CardBody,
  Collapse,
  Button,
  Progress,
} from 'reactstrap';
import Title from '../Title';
import { JobSubNav } from '../SubNavs';
import RenderInput from '../RenderInput';
import RenderSelect from '../RenderSelect';

class RenderArgs extends Component {
  render() {
    if (!this.props.fields.length) return (
      <Button
        outline
        onClick={() => this.props.fields.push('')}
      >Add argument options</Button>
    );

    return (
      <Card>
        <CardHeader><span>Args:</span></CardHeader>
        <CardBody>
          <Row>
            <Col>
              {this.props.fields.map((arg, index) => {
                return (
                  <FormGroup row key={`${index} - ${arg}`}>
                    <Label sm="3" className="text-right" for={arg}>Argument:</Label>
                    <Col sm="8">
                      <Field
                        className="form-control"
                        name={arg}
                        component={RenderInput}
                        type="text"
                        autoComplete="off"
                        />
                    </Col>
                    <Col>
                      <Button
                        close
                        onClick={() => this.props.fields.remove(index)}
                        >
                          <i
                            className="fa fa-trash text-danger"
                            aria-hidden='true'
                          ></i>
                      </Button>
                    </Col>
                  </FormGroup>
                );
              })}
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                close
                onClick={() => this.props.fields.push('')}
              >
                <i
                  className="fa fa-plus"
                  aria-hidden='true'
                ></i>
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  }
}

class RenderCommands extends Component {
  render() {
    if (!this.props.fields.length) return (
      <Button
        outline
        onClick={() => this.props.fields.push('')}
      >Add command options</Button>
    );

    return (
      <Card>
        <CardHeader><span>Command:</span></CardHeader>
        <CardBody>
          <Row>
            <Col>
              {this.props.fields.map((command, index) => {
                return (
                  <FormGroup row key={`${index} - ${command}`}>
                    <Label sm="3" className="text-right" for={command}>Argument:</Label>
                    <Col sm="8">
                      <Field
                        className="form-control"
                        name={command}
                        component={RenderInput}
                        type="text"
                        autoComplete="off"
                        onChangeListener={this.props.onChangeListener}
                        />
                    </Col>
                    <Col>
                      <Button
                        close
                        onClick={() => {
                          this.props.fields.remove(index);
                          this.props.onChangeListener();
                        }}
                        >
                          <i
                            className="fa fa-trash text-danger"
                            aria-hidden='true'
                          ></i>
                      </Button>
                    </Col>
                  </FormGroup>
                );
              })}
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                close
                onClick={() => {
                  this.props.fields.push('');
                  this.props.onChangeListener();
                }}
              >
                <i
                  className="fa fa-plus"
                  aria-hidden='true'
                ></i>
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  }
}

class RenderVolumeMounts extends Component {
  render() {
    return (
      <Row>
        <Col>
          <Row>
            <Col>
              {this.props.fields.map((volumeMount, index) => {
                return (
                <Card key={`${index} - ${volumeMount}`}>
                  <CardHeader>
                    <span>Volume mount:</span>
                    <Button
                      close
                      onClick={() => {
                        this.props.fields.remove(index);
                        this.props.onChangeListener();
                      }}
                      >
                      <i
                        className="fa fa-trash text-danger"
                        aria-hidden='true'
                        ></i>
                    </Button>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col>
                        <FormGroup row >
                          <Label sm="3" className="text-right" for={`${volumeMount}.mountPath`}>mountPath:</Label>
                          <Col sm="9">
                            <Field
                              className="form-control"
                              name={`${volumeMount}.mountPath`}
                              component={RenderInput}
                              type="text"
                              autoComplete="off"
                              onChangeListener={this.props.onChangeListener}
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup row >
                          <Label sm="3" className="text-right" for={`${volumeMount}.name`}>name:</Label>
                          <Col sm="9">
                            <Field
                              className="form-control"
                              name={`${volumeMount}.name`}
                              component={RenderSelect}
                              autoComplete="off"
                              options={this.props.availbleVolumes.filter(v => v.name).map(v => v.name)}
                              onChangeListener={this.props.onChangeListener}
                            />
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              );
            })}
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              outline
              className="pull-right"
              onClick={() => {
                this.props.fields.push({});
                this.props.onChangeListener();
              }}
              >Add volume mount</Button>
          </Col>
        </Row>
      </Col>
    </Row>
    );
  }
}

class RenderContainers extends Component {
  render() {
    return (
      <Row>
        <Col>
          <Row>
            <Col>
              {this.props.fields.map((container, index) => {
                return (
                  <Row key={this.props.fields.get(index).name} className="mb-2">
                    <Col>
                      <Card>
                        <CardBody>
                          <Button
                            close
                            onClick={() => {
                              this.props.fields.remove(index);
                              this.props.onChangeListener();
                            }}
                            >
                            <i
                              className="fa fa-trash text-danger"
                              aria-hidden='true'
                              ></i>
                          </Button>

                          <Row className="mb-2">
                            <Col>
                              <FormGroup row>
                                <Label sm="2" className="text-right" for={`${container}.name`}>Name:</Label>
                                <Col sm="5">
                                  <Field
                                    className="form-control"
                                    name={`${container}.name`}
                                    component={RenderInput}
                                    type="text"
                                    autoComplete="off"
                                    onChangeListener={this.props.onChangeListener}
                                  />
                                </Col>
                              </FormGroup>
                              <FormGroup row>
                                <Label sm="2" className="text-right" for={`${container}.image`}>Image:</Label>
                                <Col sm="8">
                                  <Field
                                    className="form-control"
                                    name={`${container}.image`}
                                    component={RenderInput}
                                    type="text"
                                    autoComplete="off"
                                    onChangeListener={this.props.onChangeListener}
                                  />
                                </Col>
                              </FormGroup>
                            </Col>
                          </Row>

                          <Row className="mb-2">
                            <Col md="10">
                              <FieldArray
                                name={`${container}.volumeMounts`}
                                component={RenderVolumeMounts}
                                availbleVolumes={this.props.availbleVolumes}
                                onChangeListener={this.props.onChangeListener}
                              />
                            </Col>
                          </Row>

                          <Row className="mb-2">
                            <Col md="10">
                              <FieldArray
                                name={`${container}.args`}
                                component={RenderArgs}
                                onChangeListener={this.props.onChangeListener}
                              />
                            </Col>
                          </Row>

                          <Row className="mb-2">
                            <Col md="10">
                              <FieldArray
                                name={`${container}.command`}
                                component={RenderCommands}
                                onChangeListener={this.props.onChangeListener}
                              />
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                );
              })}
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                outline
                className="pull-right"
                onClick={() => {
                  this.props.fields.push({});
                  this.props.onChangeListener();
                }}
                >Add container</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

class RenderVolumes extends Component {
  render() {
    return (
      <Row>
        <Col>
          <Row>
            <Col>
              {this.props.fields.map((volume, index) => {
                return (
                  <Row key={this.props.fields.get(index).name} className="mb-2">
                    <Col>
                      <Card>
                        <CardBody>
                          <Button
                            close
                            onClick={() => {
                              this.props.fields.remove(index);
                              this.props.onChangeListener();
                            }}
                            >
                            <i
                              className="fa fa-trash text-danger"
                              aria-hidden='true'
                              ></i>
                          </Button>

                          <Row className="mb-2">
                            <Col>
                              <FormGroup row>
                                <Label sm="2" className="text-right" for={`${volume}.name`}>Name:</Label>
                                <Col sm="5">
                                  <Field
                                    className="form-control"
                                    name={`${volume}.name`}
                                    component={RenderInput}
                                    type="text"
                                    autoComplete="off"
                                    onChangeListener={this.props.onChangeListener}
                                    />
                                </Col>
                              </FormGroup>
                              <FormGroup row>
                                <Label sm="2" className="text-right" for={`${volume}.type`}>Type:</Label>
                                <Col sm="5">
                                  <Field
                                    className="form-control"
                                    name={`${volume}.type`}
                                    component={RenderSelect}
                                    autoComplete="off"
                                    options={['emptyDir', 'configMap']}
                                    onChangeListener={this.props.onChangeListener}
                                    />
                                </Col>
                              </FormGroup>
                              {
                                this.props.fields.get(index).type === 'configMap' ? (
                                  <FormGroup row>
                                    <Label sm="2" className="text-right" for={`${volume}.configMap.name`}>Config Map name:</Label>
                                    <Col sm="5">
                                      <Field
                                        className="form-control"
                                        name={`${volume}.configMap.name`}
                                        component={RenderInput}
                                        type="text"
                                        autoComplete="off"
                                        onChangeListener={this.props.onChangeListener}
                                        />
                                    </Col>
                                  </FormGroup>
                                ) : null
                              }
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                );
              })}
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                outline
                className="pull-right"
                onClick={() => {
                  this.props.fields.push({});
                  this.props.onChangeListener();
                }}
                >Add volume</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

class NewJobVersionPage extends Component {

  render() {
    const { meta, job } = this.props;

    if (meta.loading.loadingPercent !== 100) return (
        <Row className="page-frame d-flex justify-content-center">
          <Col sm="12" className="mt-5">
            <Progress animated color="info" value={meta.loading.loadingPercent} />
          </Col>
        </Row>
    );

    const availbleVolumes = this.props.currentFormValues.volumes || [];

    return (
      <Row className="page-frame">
        <Col>
          <Title title={`New version of job: ${job.name}`}/>
          <JobSubNav job={job} newVersion />

          <Form>
            <Row className="mb-2">
              <Col md="6">
                <FormGroup row>
                  <Label sm="3" className="text-right" for="schedule">Schedule:</Label>
                  <Col sm="9">
                    <Field
                      className="form-control"
                      name="schedule"
                      component={RenderInput}
                      type="text"
                      autoComplete="off"
                      onChangeListener={() => this.props.triggerPreview()}
                      />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm="3" className="text-right" for="concurrencyPolicy">Concurrency Policy:</Label>
                  <Col sm="9">
                    <Field
                      className="form-control"
                      name="concurrencyPolicy"
                      component={RenderSelect}
                      autoComplete="off"
                      options={['Allow', 'Forbid', 'Replace']}
                      onChangeListener={() => this.props.triggerPreview()}
                      />
                  </Col>
                </FormGroup>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col>
                <Card>
                  <CardHeader>
                    <span>Init Containers:</span>
                    <Button
                      close
                      onClick={() => this.props.toggleCollapsed('initContainers')}
                      >
                      <i
                        className={`fa fa-${this.props.collapsed.initContainers ? 'plus' : 'minus'}`}
                        aria-hidden='true'
                        ></i>
                    </Button>
                  </CardHeader>
                  <Collapse isOpen={!this.props.collapsed.initContainers}>
                    <CardBody>
                      <FieldArray
                        name="initContainers"
                        component={RenderContainers}
                        availbleVolumes={availbleVolumes}
                        onChangeListener={() => this.props.triggerPreview()}
                        />
                    </CardBody>
                  </Collapse>
                </Card>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col>
                <Card>
                  <CardHeader>
                    <span>Containers:</span>
                    <Button
                      close
                      onClick={() => this.props.toggleCollapsed('containers')}
                      >
                      <i
                        className={`fa fa-${this.props.collapsed.containers ? 'plus' : 'minus'}`}
                        aria-hidden='true'
                        ></i>
                    </Button>
                  </CardHeader>
                  <Collapse isOpen={!this.props.collapsed.containers}>
                    <CardBody>
                      <FieldArray
                        name="containers"
                        component={RenderContainers}
                        availbleVolumes={availbleVolumes}
                        onChangeListener={() => this.props.triggerPreview()}
                        />
                    </CardBody>
                  </Collapse>
                </Card>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col>
                <Card>
                  <CardHeader>
                    <span>Volumes:</span>
                    <Button
                      close
                      onClick={() => this.props.toggleCollapsed('volumes')}
                      >
                      <i
                        className={`fa fa-${this.props.collapsed.volumes ? 'plus' : 'minus'}`}
                        aria-hidden='true'
                        ></i>
                    </Button>
                  </CardHeader>
                  <Collapse isOpen={!this.props.collapsed.volumes}>
                    <CardBody>
                      <FieldArray
                        name="volumes"
                        component={RenderVolumes}
                        onChangeListener={() => this.props.triggerPreview()}
                        />
                    </CardBody>
                  </Collapse>
                </Card>
              </Col>
            </Row>

          </Form>

          <Row>
            <Col>
              <pre className="bg-light p-2">
                <code>
                  {this.props.preview}
                </code>
              </pre>
            </Col>
          </Row>

        </Col>
      </Row>
    );
  }
}

NewJobVersionPage.propTypes = {

};

export default NewJobVersionPage;
