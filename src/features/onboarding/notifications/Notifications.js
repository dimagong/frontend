import React from "react";
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
  Label,
} from "reactstrap";
import { Trash2 } from "react-feather";
import "flatpickr/dist/themes/light.css";
import "assets/scss/plugins/forms/flatpickr/flatpickr.scss";
import { X } from "react-feather";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "assets/scss/plugins/extensions/toastr.scss";
import { ContextLayout } from "utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
// import workflowService from "services/workflow.service";
// import MultiSelect from "components/MultiSelect/multiSelect";
import { prepareTableGroupData } from "utility/table/prepareTableGroupData";

const columnDefs = [
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
        width: 250
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
                            if(window.confirm("Are you sure?")) {
                                let selectedData = this.gridApi.getSelectedRows();
                                const notification = selectedData[0];
                                // DELETE
                                // await workflowService.deleteNotification(notification);
                                // this.getNotifications();
                                // this.closeNotification();
                            }
                        }}
                    />
                </div>
            )
        }
    }
]

const Notification = () => {
console.log("hi")
  return (
    <div>
      <div>
        <Row className="app-user-list">
          <Col lg="6">
            <Card>
              <CardBody>
                <div className="d-flex justify-content-end flex-wrap mt-2">
                  <Button
                    // onClick={() => this.createNotification()}
                    color="primary d-flex-left"
                  >
                    Create
                  </Button>
                </div>
                <div className="ag-theme-material ag-grid-table">
                  {/* {this.rowData !== null ? ( */}
                    <ContextLayout.Consumer>
                      {(context) => (
                        <AgGridReact
                          gridOptions={{}}
                          rowSelection="multiple"
                          defaultColDef={{resizable: true}}
                          columnDefs={columnDefs}
                          rowData={[]}
                        //   onGridReady={this.onGridReady}
                          colResizeDefault={"shift"}
                          animateRows={true}
                          floatingFilter={false}
                          pagination={true}
                          pivotPanelShow="always"
                          paginationPageSize={20}
                          resizable={true}
                          enableRtl={context.state.direction === "rtl"}
                        //   onSelectionChanged={() => this.onSelectionChanged()}
                        />
                      )}
                    </ContextLayout.Consumer>
                  {/* ) : null} */}
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col sm="6">
            {/* {this.state.notificationEdit ? ( */}
            {true ? (
              <Col col="md-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-weight-bold">
                      Notification
                    </CardTitle>
                    <X
                      size={15}
                      className="cursor-pointer"
                    //   onClick={() => this.closeNotification()}
                    />
                  </CardHeader>
                  <CardBody className="card-top-padding">
                    <Form className="mt-1">
                      <FormGroup>
                        <Label>Name</Label>
                        <Input
                        //   value={this.state.notificationTemplate.name}
                        //   onChange={(event) =>
                        //     this.setState({
                        //       notificationTemplate: {
                        //         ...this.state.notificationTemplate,
                        //         name: event.target.value,
                        //       },
                        //     })
                        //   }
                          type="text"
                          name="name"
                          placeholder="Name"
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>Description</Label>
                        <Input
                        //   value={this.state.notificationTemplate.description}
                        //   onChange={(event) =>
                        //     this.setState({
                        //       notificationTemplate: {
                        //         ...this.state.notificationTemplate,
                        //         description: event.target.value,
                        //       },
                        //     })
                        //   }
                          type="textarea"
                          name="description"
                          placeholder="Description"
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>Content</Label>
                        <Input
                        //   value={this.state.notificationTemplate.content}
                        //   onChange={(event) =>
                        //     this.setState({
                        //       notificationTemplate: {
                        //         ...this.state.notificationTemplate,
                        //         content: event.target.value,
                        //       },
                        //     })
                        //   }
                          type="textarea"
                          name="content"
                          placeholder="Content"
                        />
                      </FormGroup>
                      {/* <MultiSelect
                        ref={this.multiSelectRef}
                        groups={this.selectGroup()}
                      /> */}
                      <div className="d-flex justify-content-center flex-wrap mt-2">
                        <Button
                          color="primary d-flex-left"
                        //   onClick={() => this.submitNotification()}
                        >
                          Save
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            ) : null}
          </Col>
          <ToastContainer />
        </Row>
      </div>
    </div>
  );
};

export default Notification;
