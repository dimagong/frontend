import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  FormGroup,
  Row,
  Col,
  Input,
  Form,
  Button,
  Label, Badge,
} from "reactstrap"
import {
  Trash2
} from "react-feather"
import "flatpickr/dist/themes/light.css";
import "assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import {X} from "react-feather"
import {toast} from "react-toastify"
import {ToastContainer} from "react-toastify"
import "assets/scss/plugins/extensions/toastr.scss"
import {connect} from "react-redux"
import {ContextLayout} from "utility/context/Layout"
import {AgGridReact} from "ag-grid-react"
import "assets/scss/plugins/tables/_agGridStyleOverride.scss"
import workflowService from 'services/workflow.service'
import MultiSelect from "components/MultiSelect/multiSelect";

class Notification extends React.Component {
  state = {
    notificationEdit: false,
    gridClearSelection: false,
    pageSize: 20,
    modalType: 'create',
    notifications: [],
    notificationTemplate: {
      name: '',
      description: '',
      content: '',
      groups: [],
    },
    columnDefs: [
      {
        headerName: "Name",
        field: "name",
        suppressSizeToFit: false,
        width: 250
      },
      {
        headerName: "Description",
        field: "description",
        suppressSizeToFit: false,
        width: 250
      },
      {
        headerName: "Content",
        field: "content",
        suppressSizeToFit: false,
        width: 250
      },
      {
        headerName: "Organizations",
        field: "groups",
        suppressSizeToFit: false,
        width: 250,
        cellRendererFramework: params => {
          return params.value.map(next => (
            <Badge color="primary" style={{margin: '1px'}}>
              {next.name}
            </Badge>
          ))
        }
      },
      {
        headerName: "Actions",
        field: "transactions",
        suppressSizeToFit: false,
        width: 250,
        cellRendererFramework: params => {
          return (
            <div className="actions cursor-pointer">
              <Trash2
                className="mr-50"
                size={15}
                onClick={async () => {
                  if (window.confirm("Are you sure?")) {
                    let selectedData = this.gridApi.getSelectedRows();
                    const notification = selectedData[0];
                    await workflowService.deleteNotification(notification);
                    this.getNotifications();
                    this.closeNotification();
                  }
                }}
              />
            </div>
          )
        }
      }
    ],
    defaultColDef: {
      resizable: true,
    },
    rowData: []
  };

  constructor(props) {
    super(props);
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);

    this.notificationTemplate = {
      name: '',
      description: '',
      content: '',
      groups: [],
    };
    this.multiSelectRef = React.createRef();
  }

  onSetSidebarOpen(open) {
    this.setState({notificationEdit: open});
  }

  async getNotifications() {
    const response = await workflowService.getNotifications();
    this.setState({notifications: response.data.data});
  }

  async componentDidMount() {
    this.getNotifications();
  }

  componentDidUpdate(prevProp, prevState) {
    const notification = this.selectGroup();
    if (prevState.notificationTemplate !== this.state.notificationTemplate) {
      this.setState({...this.state.notificationTemplate, groups: notification.groups})
    }
  }

  closeNotification() {
    this.setState({notificationEdit: false, gridClearSelection: true}, () => {
      this.clearGridSelection();
    });
  }

  componentWillMount() {
  }

  setDFormTypeModal(type) {
    switch (type) {
      case 'create': {
        this.setState({modalType: type})
        break;
      }
      case 'edit': {
        this.setState({modalType: type})
        break;
      }
    }
  }


  onGridReady = (params) => {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();

    window.addEventListener('resize', () => {
      this.gridApi.sizeColumnsToFit();
    });
  }

  notificationOpen() {
    this.setState({notificationEdit: true});
  }

  onSelectionChanged() {
    if (this.state.gridClearSelection) {
      this.setState({gridClearSelection: false});
      return;
    }

    let selectedData = this.gridApi.getSelectedRows();
    const notification = selectedData[0];
    this.setState({notificationTemplate: notification});
    this.notificationOpen();
    this.setDFormTypeModal('edit');
  }

  clearGridSelection() {
    this.gridApi.deselectAll();
    this.gridApi.clearFocusedCell();
  }

  createNotification() {
    this.setDFormTypeModal('create');
    this.notificationOpen();
    this.setState({notificationTemplate: this.notificationTemplate});
  }

  async submitNotification() {
    if (this.state.modalType === 'create') {
      await this.submitCreateNotification();
    } else {
      await this.submitUpdateNotification();
    }
    await this.getNotifications();
  }

  async submitCreateNotification() {
    try {
      const response = await workflowService.createNotification({
        ...this.state.notificationTemplate,
        groups: this.multiSelectRef.current.getMultiSelectState()
      });
      this.closeNotification();
      toast.success('Success')
    } catch (error) {
      if ('response' in error) {
        if ('error' in error.response.data) {
          toast.error(error.response.data.error.message)
        }
      }
    }

  }

  async submitUpdateNotification() {
    try {
      const response = await workflowService.updateNotification({
        ...this.state.notificationTemplate,
        groups: this.multiSelectRef.current.getMultiSelectState()
      });
      toast.success('Success')
    } catch (error) {
      if ('response' in error) {
        if ('error' in error.response.data) {
          toast.error(error.response.data.error.message)
        }
      }
    }
  }


  selectGroup() {
    if (this.state.modalType === 'create') {
      return this.state.notificationTemplate;
    } else {
      return this.state.notifications.find((notification) => {
        return this.state.notificationTemplate.id === notification.id
      })
    }
  }

  render() {
    const {rowData, columnDefs, defaultColDef, pageSize} = this.state
    const notificationEditElement = <Card style={{height: 'calc(100%)', 'margin-bottom': 0}}>
      <CardHeader>
        <CardTitle>
          Notification edit
        </CardTitle>
      </CardHeader>
      <CardBody>

      </CardBody>
    </Card>

    return (
      <div>
        <div>
          <Row className="app-user-list">
            <Col lg="6">
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-end flex-wrap mt-2">
                    <Button onClick={() => this.createNotification()} color="primary d-flex-left">Create</Button>
                  </div>
                  <div className="ag-theme-material ag-grid-table">
                    {this.rowData !== null ? (
                      <ContextLayout.Consumer>
                        {context => (
                          <AgGridReact
                            gridOptions={{}}
                            rowSelection="multiple"
                            defaultColDef={defaultColDef}
                            columnDefs={columnDefs}
                            rowData={this.state.notifications}
                            onGridReady={this.onGridReady}
                            colResizeDefault={"shift"}
                            animateRows={true}
                            floatingFilter={false}
                            pagination={true}
                            pivotPanelShow="always"
                            paginationPageSize={pageSize}
                            resizable={true}
                            enableRtl={context.state.direction === "rtl"}
                            onSelectionChanged={() => this.onSelectionChanged()}
                          />
                        )}
                      </ContextLayout.Consumer>
                    ) : null}
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="6">
              {
                this.state.notificationEdit ?
                  <Col col="md-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-weight-bold">Notification</CardTitle>
                        <X size={15} className="cursor-pointer" onClick={() => this.closeNotification()}/>
                      </CardHeader>
                      <CardBody className="card-top-padding">
                        <Form className="mt-1">
                          <FormGroup>
                            <Label>Name</Label>
                            <Input value={this.state.notificationTemplate.name} onChange={(event) => this.setState({
                              notificationTemplate: {
                                ...this.state.notificationTemplate,
                                name: event.target.value
                              }
                            })} type="text" name="name" placeholder="Name"/>
                          </FormGroup>
                          <FormGroup>
                            <Label>Description</Label>
                            <Input value={this.state.notificationTemplate.description}
                                   onChange={(event) => this.setState({
                                     notificationTemplate: {
                                       ...this.state.notificationTemplate,
                                       description: event.target.value
                                     }
                                   })} type="textarea" name="description" placeholder="Description"/>
                          </FormGroup>
                          <FormGroup>
                            <Label>Content</Label>
                            <Input value={this.state.notificationTemplate.content} onChange={(event) => this.setState({
                              notificationTemplate: {
                                ...this.state.notificationTemplate,
                                content: event.target.value
                              }
                            })} type="textarea" name="content" placeholder="Content"/>
                          </FormGroup>
                          <MultiSelect ref={this.multiSelectRef} groups={this.selectGroup().groups}/>
                          <div className="d-flex justify-content-center flex-wrap mt-2">
                            <Button color="primary d-flex-left" onClick={() => this.submitNotification()}>Save</Button>
                          </div>
                        </Form>
                      </CardBody>
                    </Card>
                  </Col> : null
              }
            </Col>
            <ToastContainer/>
          </Row>
        </div>
      </div>

    )
  }
}

const mapStateToProps = state => {
  return {}
}
const mapActionsToProps = (dispatch) => {
  return {}
}
export default connect(mapStateToProps, mapActionsToProps)(Notification)
