import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  Button,
} from "reactstrap"
import {
  Trash2,
} from "react-feather"
import "flatpickr/dist/themes/light.css";
import "../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import {X, Eye, EyeOff} from "react-feather"

import workflowService from '../../../services/workflow.service'

import {toast} from "react-toastify"
import {ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../../assets/scss/plugins/extensions/toastr.scss"
import {connect} from "react-redux"
import {ContextLayout} from "../../../utility/context/Layout"
import {AgGridReact} from "ag-grid-react"
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import FormCreate from './FormCreate/FormCreate'
import rfdc from 'rfdc';
import Form from "@rjsf/core";
import {debounce} from "lodash";

const clone = rfdc();

class DForm extends React.Component {
  state = {
    gridClearSelection: false,
    dFormEdit: false,
    pageSize: 20,
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
      // {
      //     headerName: "Access type",
      //     field: "access_type",
      //     suppressSizeToFit: false,
      //     width: 250
      // },
      // {
      //     headerName: "Status",
      //     field: "status",
      //     suppressSizeToFit: false,
      //     width: 250
      // },
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
                    const dForm = selectedData[0];
                    await workflowService.deleteDformTemplate(dForm);
                    this.getDForms();
                    this.closeDForm();
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
    dFormTypeModal: 'create',
    isStateConfig: true,
    dFormTemplate: {},
    dForm: {
      schema: {
        title: "POC Form construction",
        type: "object",
        required: [],
        properties: {
          text: {
            type: "string",
            title: "Text title",
            default: '',
          },
          text2: {
            type: "string",
            title: "Text title2",
            default: '',
          },
          text3: {
            type: "string",
            title: "Text title3",
            default: '',
          },
          date: {
            type: "string",
            title: "Date title",
            format: "date-time"
          },
          date2: {
            type: "string",
            title: "Date title",
            format: "date-time"
          },
          select: {
            "type": "string",
            "title": "Select title",
            "enum": [
              "test1",
              "test2"
            ]
          },
          multiSelect: {
            "type": "array",
            "uniqueItems": true,
            title: "MutilSelect title",
            "items": {
              "title": "Color",
              "type": "string",
              "anyOf": [
                {
                  "type": "string",
                  "enum": [
                    "value1"
                  ],
                  "title": "key1"
                },
                {
                  "type": "string",
                  "enum": [
                    "value2"
                  ],
                  "title": "key2"
                }
              ]
            }
          },
        }
      },
      uiSchema: {
        groupStates: {},
        sectionStates: {},
        columnsClasses: {
          date: "col-md-6",
          date2: "col-md-6",
        },
        groups: {
          text: "Main group",
          text2: "Test group",
          select: "Main group",
          multiSelect: "Not main group",
        },
        sections: {
          text: "Main section",
          text2: "Main section",
          date: "Main section",
          date2: "Main section",
          select: "Main section",
          multiSelect: "Other",
        },
        dependencies: {
          sections: {
            // 'Main section': {
            //     conditions: [
            //         {
            //             type: "validation",
            //             fields: ['text'],
            //             groups: ['Main group'],
            //             sections: ['Another section']
            //         }
            //     ],
            //     effect: 'hidden'
            // },
          },
          groups: {
            // 'Main group': {
            //     conditions: [
            //         {
            //             type: "validation",
            //             fields: ['text'],
            //             groups: ['Some group'],
            //         }
            //     ],
            //     effect: 'hidden'
            // },
          },
          fields: {
            // 'date': {
            //     conditions: [
            //         {
            //             type: "validation",
            //             fields: ['text'],
            //             groups: [],
            //             sections: [],
            //             fieldOperators: [
            //                 {
            //                     field: 'text',
            //                     operator: '=',
            //                     value: 'test'
            //                 }
            //             ]
            //         }
            //     ],
            //     effect: 'disabled'
            // }
          }
        }
      }
    },
    rowData: []
  };

  constructor(props) {
    super(props);

    this.dFormTemplate = {
      name: '',
      description: '',
      schema: {
        schema: {
          properties: {},
          required: [],
          type: "object",
        },
        uiSchema: {
          groupStates: {},
          sectionStates: {},
          sections: {},
          onlySections: {
            "Main section": true,
            "Main section2": true,
          },
          sectionGroups: {
            "Group 1": "Main section",
            "Group 2": "Main section",
          },
          groups: {},
          columnsClasses: {},
          dependencies: {
            sections: {},
            groups: {},
            fields: {}
          }
        }
      },
      status: 'in-progress',
      reviewer_user_id: 1,
      manager_user_id: 1,
      assigned_user_id: 1,
      entity_id: 1,
      entity_type: 'App\\Workflow'
    };

    this.state.dFormTemplate = this.dFormTemplate;
    // this.state.dFormTemplate.schema.schema = this.state.dForm.schema;
    // this.state.dFormTemplate.schema.uiSchema = this.state.dForm.uiSchema;
  }

  dFormOpen() {
    this.setState({dFormEdit: false}, () => {
      this.setState({dFormEdit: true});
    });
  }

  closeDForm() {
    this.setState({dFormEdit: false, gridClearSelection: true}, () => {
      this.clearGridSelection();
    });
  }

  async getDForms() {
    const response = await workflowService.getDFormTemplateAll();
    let dForms = response.data.data;
    dForms = dForms.map((dForm) => {
      if (dForm.schema) {
        if (Array.isArray(dForm.schema.uiSchema.columnsClasses)) {
          dForm.schema.uiSchema.columnsClasses = {};
        }
        if (Array.isArray(dForm.schema.uiSchema.dependencies.fields)) {
          dForm.schema.uiSchema.dependencies.fields = {};
        }
        if (Array.isArray(dForm.schema.uiSchema.dependencies.groups)) {
          dForm.schema.uiSchema.dependencies.groups = {};
        }
        if (Array.isArray(dForm.schema.uiSchema.dependencies.sections)) {
          dForm.schema.uiSchema.dependencies.sections = {};
        }
        if (Array.isArray(dForm.schema.uiSchema.dependencies.groupStates)) {
          dForm.schema.uiSchema.dependencies.groupStates = {};
        }
        if (Array.isArray(dForm.schema.uiSchema.dependencies.sectionStates)) {
          dForm.schema.uiSchema.dependencies.sectionStates = {};
        }
      }
      return dForm;
    });
    this.setState({rowData: response.data.data})
  }

  async componentDidMount() {
    this.getDForms();
  }

  componentWillMount() {
  }


  onGridReady = (params) => {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();

    window.addEventListener('resize', () => {
      this.gridApi.sizeColumnsToFit();
    });
  }

  setDFormTypeModal(type) {
    switch (type) {
      case 'create': {
        this.setState({dFormTypeModal: type})
        break;
      }
      case 'edit': {
        this.setState({dFormTypeModal: type})
        break;
      }
        default: {
          break;
        }
    }
  }

  onSelectionChanged() {
    if (this.state.gridClearSelection) {
      this.setState({gridClearSelection: false});
      return;
    }

    let selectedData = this.gridApi.getSelectedRows();
    const dForm = selectedData[0];
    this.setState({dFormTemplate: dForm});
    this.setDFormTypeModal('edit');
    this.dFormOpen();
  }

  clearGridSelection() {
    this.gridApi.deselectAll();
    this.gridApi.clearFocusedCell();
  }

  changeStateConfig(toggle) {
    this.setState({isStateConfig: toggle})
  }

  createDForm() {
    this.setDFormTypeModal('create');
    this.setState({dFormTemplate: this.dFormTemplate})
    this.dFormOpen();
  }

  async submitDForm(dForm, {name, description, protected_properties}) {

    const dFormChanges = clone(dForm);
    dFormChanges.name = name;
    dFormChanges.description = description;
    dFormChanges.protected_properties = protected_properties;

    if (this.state.dFormTypeModal === 'create') {
      try {
        await workflowService.createTemplateDForm(dFormChanges);
        this.getDForms();
        this.closeDForm();
        toast.success('Success')
      } catch (error) {
        if ('response' in error) {
          if ('error' in error.response.data) {
            toast.error(error.response.data.error.message)
          }
        }
      }
    } else {
      try {
        await workflowService.updateDFormTemplate(dFormChanges);
        this.getDForms();
        this.closeDForm();
        toast.success('Success')
      } catch (error) {
        if ('response' in error) {
          if ('error' in error.response.data) {
            toast.error(error.response.data.error.message)
          }
        }
      }
    }
  }

  render() {
    const {rowData, columnDefs, defaultColDef, pageSize} = this.state

    return (
      <div>
        <div>
          <Row className="app-user-list">
            <Col md="6">
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-end flex-wrap mt-2">
                    <Button onClick={() => this.createDForm()} color="primary d-flex-left">Create</Button>
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
                            rowData={rowData}
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
            <Col md="6">
              {
                this.state.dFormEdit ?
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-weight-bold">DForm</CardTitle>
                      <div>
                        {
                          this.state.isStateConfig ?
                            <EyeOff size={15} className="cursor-pointer mr-1"
                                    onClick={() => this.changeStateConfig(false)}/>
                            :
                            <Eye size={15} className="cursor-pointer mr-1"
                                 onClick={() => this.changeStateConfig(true)}/>
                        }
                        <X size={15} className="cursor-pointer mr-1" onClick={() => this.closeDForm()}/>
                      </div>

                    </CardHeader>
                    <CardBody className="card-top-padding">
                      <FormCreate fileLoader={false} submitDForm={(dForm, data) => this.submitDForm(dForm, data)}
                                  liveValidate={false}
                                  dForm={this.state.dFormTemplate} isStateConfig={this.state.isStateConfig}
                      ></FormCreate>
                    </CardBody>
                  </Card>
                  : null
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
export default connect(mapStateToProps, mapActionsToProps)(DForm)
