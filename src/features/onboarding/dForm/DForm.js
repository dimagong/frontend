import React, {useState ,useRef, useEffect} from 'react'
import {
  Card,
  CardBody,
  Row,
  Col,
  Button,
} from "reactstrap"
import "flatpickr/dist/themes/light.css";
import "assets/scss/plugins/forms/flatpickr/flatpickr.scss"

import {ContextLayout} from "utility/context/Layout"
import {AgGridReact} from "ag-grid-react"
import "assets/scss/plugins/tables/_agGridStyleOverride.scss"
import { ChangeDetectionStrategyType } from 'ag-grid-react/lib/changeDetectionService'
import { columnDefs } from "./gridSettings";
import { useDispatch, useSelector } from "react-redux";
import {
  selectdForms,
  selectdForm,
} from "app/selectors/onboardingSelectors";
import DFormForm from './DFormForm'
import {initDForm} from "./settings"

import onboardingSlice from 'app/slices/onboardingSlice';
import appSlice from 'app/slices/appSlice'

const {
  setdForm,
} = onboardingSlice.actions;

const {
  getdFormsRequest,
  deletedFormRequest,
} = appSlice.actions;

const DForm = () => {
  const [gridApi, setGridApi] = useState(null);
  const dForms = useSelector(selectdForms)
  const dForm = useSelector(selectdForm)
  const dispatch = useDispatch();
  const isCreate = useRef(false)

  useEffect(() => {
    !dForms.length && dispatch(getdFormsRequest());
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    dispatch(setdForm(selectedRow));
    isCreate.current = false;
  };

  const clearGridSelection = () => {
    gridApi.deselectAll();
    gridApi.clearFocusedCell();
  };

  // TODO: END - AG GRID API

  const createDForm = () => {
    dispatch(setdForm(initDForm));
    isCreate.current = true;

  }

  const handleDelete = (params) => {
    if(window.confirm("Are you sure?")) {
      dispatch(deletedFormRequest(params.data));
    }
  }

    return (
        <div className="dform">
        <div>
          <Row className="app-user-list">
            <Col md="6">
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-end flex-wrap mt-2">
                    <Button onClick={createDForm} color="primary d-flex-left">Create</Button>
                  </div>
                  <div className="ag-theme-material ag-grid-table">
                      <ContextLayout.Consumer>
                        {context => (
                          <AgGridReact
                            rowDataChangeDetectionStrategy={ChangeDetectionStrategyType.IdentityCheck}
                            gridOptions={{}}
                            rowSelection="multiple"
                            defaultColDef={{resizable: true}}
                            columnDefs={columnDefs({handleDelete})}
                            rowData={dForms}
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
              {dForm ? <DFormForm clearGridSelection={clearGridSelection} isCreate={isCreate}/>: null}
            </Col>
          </Row>
        </div>

      </div>
    )
}

export default DForm
