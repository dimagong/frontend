import React, {useState ,useRef, useEffect} from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  Button, Badge,
} from "reactstrap"
// import {
//   Trash2,
// } from "react-feather"
import "flatpickr/dist/themes/light.css";
import "assets/scss/plugins/forms/flatpickr/flatpickr.scss"
// import {X, Eye, EyeOff} from "react-feather"

// import workflowService from 'services/workflow.service'

import {toast} from "react-toastify"
import {ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "assets/scss/plugins/extensions/toastr.scss"
import {ContextLayout} from "utility/context/Layout"
import {AgGridReact} from "ag-grid-react"
import "assets/scss/plugins/tables/_agGridStyleOverride.scss"
// import FormCreate from '../FormCreate/FormCreate'
// import rfdc from 'rfdc';
// import Form from "@rjsf/core";
// import {debounce} from "lodash";
// import {prepareTableGroupData} from "utility/table/prepareTableGroupData"
// import MultiSelect from "components/MultiSelect/multiSelect";
import { ChangeDetectionStrategyType } from 'ag-grid-react/lib/changeDetectionService'
import { columnDefs } from "./gridSettings";
import { useDispatch, useSelector } from "react-redux";
import {
  selectdForms,
  selectdForm,
} from "app/selectors/onboardingSelectors";
import DFormForm from './DFormForm'
import { getdFormsRequest } from "app/slices/appSlice";

const DForm = () => {
  const [gridApi, setGridApi] = useState(null);
  const DForms = useSelector(selectdForms)
  const DForm = useSelector(selectdForm)
  const dispatch = useDispatch();
  const isCreate = useRef(false)

  useEffect(() => {
    DForms && dispatch(getdFormsRequest());
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
    // dispatch(setDForm(selectedRow));
    isCreate.current = false;
  };

  // TODO: END - AG GRID API

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
                      <ContextLayout.Consumer>
                        {context => (
                          <AgGridReact
                            rowDataChangeDetectionStrategy={ChangeDetectionStrategyType.IdentityCheck}
                            gridOptions={{}}
                            rowSelection="multiple"
                            defaultColDef={{resizable: true}}
                            columnDefs={columnDefs({handleDelete: () => null})}
                            rowData={DForms}
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
            <Col md="6">
              {DForm ? <DFormForm/>: null}
            </Col>
            <ToastContainer/>
          </Row>
        </div>

      </div>
    )
}

export default DForm
