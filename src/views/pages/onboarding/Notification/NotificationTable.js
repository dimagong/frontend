import React, { Component } from "react";
import {
    Card,
    CardBody,
    Button,
} from "reactstrap";
import { ContextLayout } from "utility/context/Layout"
import { AgGridReact } from "ag-grid-react"
import "assets/scss/plugins/tables/_agGridStyleOverride.scss"
import {
    Trash2
} from "react-feather"
import workflowService from 'services/workflow.service'

export class NotificationTable extends Component {
    state = {
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
    }
  render() {
    return (
      <Card>
        <CardBody>
          <div className="d-flex justify-content-end flex-wrap mt-2">
            <Button
              onClick={() => this.createNotification()}
              color="primary d-flex-left"
            >
              Create
            </Button>
          </div>
          <div className="ag-theme-material ag-grid-table">
            {this.rowData !== null ? (
              <ContextLayout.Consumer>
                {(context) => (
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
    );
  }
}

export default NotificationTable;
