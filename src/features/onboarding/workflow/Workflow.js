import React, {useState ,useRef, useEffect} from 'react'
import WorkflowForm from './components/WorkflowForm'
import {
  Card,
  CardBody,
  Row,
  Col,
  Button,
} from "reactstrap"
import { setWorkflow } from "app/slices/onboardingSlice";


import {ContextLayout} from "utility/context/Layout"
import {AgGridReact} from "ag-grid-react"
import "assets/scss/plugins/tables/_agGridStyleOverride.scss"
import { columnDefs } from "./gridSettings";
import { useDispatch, useSelector } from "react-redux";
import { ChangeDetectionStrategyType } from 'ag-grid-react/lib/changeDetectionService'
import {
    selectWorkflows,
    selectWorkflow,
  } from "app/selectors/onboardingSelectors";
  import { getWorkflowsRequest, deleteWorkflowRequest } from "app/slices/appSlice";
import {initWorkflow} from './components/constants';

const Workflow = () => {
    const [gridApi, setGridApi] = useState(null);
    const workflows = useSelector(selectWorkflows)
    const workflow = useSelector(selectWorkflow)
    const dispatch = useDispatch();
    const workflowModalType = useRef("Create")

    useEffect(() => {
        !workflows.length && dispatch(getWorkflowsRequest());
      }, []);

       // TODO: START - AG GRID API
       const  onGridReady = (params) => {
        setGridApi(params.api);
        params.api.sizeColumnsToFit();

        window.addEventListener("resize", () => {
          params.api.sizeColumnsToFit();
        });
      }

      const onSelectionChanged = () => {
        const [selectedRow] = gridApi.getSelectedRows();
        workflowModalType.current = "Edit";
        dispatch(setWorkflow(selectedRow));
      };
      const clearGridSelection = () => {
        gridApi.deselectAll();
        gridApi.clearFocusedCell();
      };

      // TODO: END - AG GRID API

      const deleteWorkflow = (params) => {
        if(window.confirm("Are you sure?")) {
          dispatch(deleteWorkflowRequest(params.data))
      }
      }

      const createWorkflow = () => {
        dispatch(setWorkflow(initWorkflow))
        workflowModalType.current = "Create";
      }

    return (
        <div className="workflow">
        <div>
          <Row className="app-user-list">
            <Col lg="6">

              <Card>
                <CardBody>
                  <div className="d-flex justify-content-end flex-wrap mt-2">
                    <Button onClick={createWorkflow} color="primary d-flex-left">Create</Button>
                  </div>
                  <div className="ag-theme-material ag-grid-table">
                      <ContextLayout.Consumer>
                        {context => (
                          <AgGridReact
                            rowDataChangeDetectionStrategy={ChangeDetectionStrategyType.IdentityCheck}
                            gridOptions={{}}
                            rowSelection="multiple"
                            defaultColDef={{ resizable: true, }}
                            columnDefs={columnDefs({deleteWorkflow})}
                            rowData={workflows}
                            onGridReady={onGridReady}
                            colResizeDefault={"shift"}
                            animateRows={true}
                            floatingFilter={false}
                            pagination={true}
                            pivotPanelShow="always"
                            paginationPageSize={20}
                            resizable={true}
                            enableRtl={context.state.direction === "rtl"}
                            onSelectionChanged={onSelectionChanged}
                          />
                        )}
                      </ContextLayout.Consumer>
                  </div>
                </CardBody>
              </Card>
            </Col>
            {
              workflow ?<WorkflowForm clearGridSelection={clearGridSelection} workflowModalType={workflowModalType.current}/> : null
            }
          </Row>
        </div>
      </div>
    )
}

export default Workflow
