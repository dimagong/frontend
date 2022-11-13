import React, { useRef, useEffect } from "react";
import { Card, CardBody, Row, Col, CardTitle, CardHeader } from "reactstrap";
import { AgGridReact } from "ag-grid-react";

import { useDispatch, useSelector } from "react-redux";
import { selectInvitations } from "app/selectors";
import { columnDefs } from "./gridSettings";
import { toast } from "react-toastify";
import { X } from "react-feather";

import appSlice from "app/slices/appSlice";

const { getInvitationsRequest, revokeInvitationsRequest, setContext } = appSlice.actions;

const UserInvitations = ({ activeTab }) => {
  const gridApi = useRef(null);
  const dispatch = useDispatch();
  const invitations = useSelector(selectInvitations);

  useEffect(() => {
    !invitations.length && dispatch(getInvitationsRequest());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeTab === "3") {
      gridApi.current.sizeColumnsToFit();
    }
  }, [activeTab]);

  // TODO: START - AG GRID API

  const onGridReady = (params) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();

    window.addEventListener("resize", () => {
      params.api.sizeColumnsToFit();
    });
  };

  // TODO: END - AG GRID API

  const revokeInvitation = () => {
    const [selectedRow] = gridApi.current.getSelectedRows();
    dispatch(revokeInvitationsRequest({ invitationId: selectedRow.id }));
  };

  const onCopy = () => {
    toast.success("Invitation link copied successfully", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000,
    });
  };

  const closeInvitations = () => {
    dispatch(setContext(null));
  };

  return (
    <Row className="app-user-list">
      <Col sm="12" md="12" lg="12" xl="7">
        <Card>
          <CardHeader>
            <CardTitle className="font-weight-bold">Invitations</CardTitle>
            <X size={15} className="cursor-pointer" onClick={() => closeInvitations()} />
          </CardHeader>
          <CardBody>
            <div className="ag-theme-material ag-grid-table">
              <AgGridReact
                gridOptions={{}}
                rowSelection="multiple"
                defaultColDef={{
                  sortable: true,
                  resizable: true,
                  suppressSizeToFit: false,
                }}
                columnDefs={columnDefs({ onCopy, revokeInvitation })}
                rowData={invitations}
                onGridReady={onGridReady}
                colResizeDefault={"shift"}
                animateRows={true}
                floatingFilter={false}
                pagination={true}
                pivotPanelShow="always"
                paginationPageSize={20}
                resizable={true}
              />
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default UserInvitations;
