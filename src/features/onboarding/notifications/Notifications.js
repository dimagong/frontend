import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  Button,
} from "reactstrap";
// import { X } from "react-feather";
// import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "assets/scss/plugins/extensions/toastr.scss";
import { ContextLayout } from "utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
// import workflowService from "services/workflow.service";
// import MultiSelect from "components/MultiSelect/multiSelect";
// import { prepareTableGroupData } from "utility/table/prepareTableGroupData";
import { columnDefs } from "./gridSettings";
import { getNotificationsRequest, deleteNotificationRequest } from "app/slices/appSlice";
import { setNotification } from "app/slices/onboardingSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  selectNotifications,
  selectNotification,
} from "app/selectors/onboardingSelectors";
import NotificationsForm from "./NotificationsForm";
import { ChangeDetectionStrategyType } from 'ag-grid-react/lib/changeDetectionService'

const initNotification = {name: '',description:"", content: "", groups: []};

const Notification = () => {
  const [gridApi, setGridApi] = useState(null);
  const notifications = useSelector(selectNotifications);
  const notification = useSelector(selectNotification);
  const dispatch = useDispatch();
  const isCreate = useRef(false)

  useEffect(() => {
    !notifications.length && dispatch(getNotificationsRequest());
  }, []);

  // TODO: START - AG GRID API
  function onGridReady(params) {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();

    window.addEventListener("resize", () => {
      params.api.sizeColumnsToFit();
    });
  }

  const onSelectionChanged = () => {
        const [selectedRow] = gridApi.getSelectedRows();
    dispatch(setNotification(selectedRow));
    isCreate.current = false;
  };

  const clearGridSelection = () => {
    gridApi.deselectAll();
    gridApi.clearFocusedCell();
  };
  // TODO: END - AG GRID API

  const createNotification = (e) => {
    e.preventDefault();
    dispatch(setNotification(initNotification))
    isCreate.current = true;
  }

  function handleDelete(params) {
    if(window.confirm("Are you sure?")) {
        dispatch(deleteNotificationRequest(params.data))
    }
}

  return (
    <div className="notifications">
      <div>
        <Row className="app-user-list">
          <Col lg="6">
            <Card>
              <CardBody>
                <div className="d-flex justify-content-end flex-wrap mt-2">
                  <Button
                    onClick={createNotification}
                    color="primary d-flex-left"
                  >
                    Create
                  </Button>
                </div>
                <div className="ag-theme-material ag-grid-table">
                  <ContextLayout.Consumer>
                    {(context) => (
                      <AgGridReact
                        rowDataChangeDetectionStrategy={ChangeDetectionStrategyType.IdentityCheck}
                        gridOptions={{}}
                        rowSelection="multiple"
                        defaultColDef={{ resizable: true }}
                        columnDefs={columnDefs({handleDelete})}
                        rowData={notifications}
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
          {notification ? <NotificationsForm clearGridSelection={clearGridSelection} isCreate={isCreate}/> : null}
          <ToastContainer />
        </Row>
      </div>
    </div>
  );
};

export default Notification;
