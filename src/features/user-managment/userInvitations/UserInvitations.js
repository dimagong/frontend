import React, { useRef, useEffect } from 'react'
import {
    Card,
    CardBody,
    Row,
    Col,
} from "reactstrap"
import { ContextLayout } from "utility/context/Layout"
import { AgGridReact } from "ag-grid-react"

// import { setEditUser } from '../../../redux/actions/user-management/userEditActions'
// import { setUserList } from '../../../redux/actions/user/userActions'
// import { setInvitationsList } from '../../../redux/actions/user-management/InvitationsActions'
import { useDispatch, useSelector } from "react-redux";
import { selectInvitations } from "app/selectors";
import { columnDefs } from "./gridSettings";
import { getInvitationsRequest, revokeInvitationsRequest } from "app/slices/appSlice";
import { toast } from "react-toastify"

const UserInvitations = ({activeTab}) => {
    const gridApi = useRef(null);
    const dispatch = useDispatch();
    const invitations = useSelector(selectInvitations)

    useEffect(() => {
        !invitations.length && dispatch(getInvitationsRequest())
    }, [])

    useEffect(() => {
        if(activeTab === "3"){
            gridApi.current.sizeColumnsToFit()
        }
    },[activeTab])

      // TODO: START - AG GRID API

    const onGridReady = (params) => {
        gridApi.current = params.api;
        params.api.sizeColumnsToFit();
    
        window.addEventListener("resize", () => {
          params.api.sizeColumnsToFit();
        });
    }


      // TODO: END - AG GRID API

    const revokeInvitation = () => {
        const [selectedRow] = gridApi.current.getSelectedRows();
        dispatch(revokeInvitationsRequest({invitationId:selectedRow.id}))
    }

    const onCopy = () => {
        toast.success("Invitation link copied successfully", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000
        })
    }

   

    return (
        <Row className="app-user-list">
                <Col sm="12">
                    <Card>
                        <CardBody>
                            <div className="ag-theme-material ag-grid-table">
                                <ContextLayout.Consumer>
                                    {context => (
                                        <AgGridReact
                                            gridOptions={{}}
                                            rowSelection="multiple"
                                            defaultColDef={{
                                                sortable: true,
                                                resizable: true,
                                                suppressSizeToFit: false,
                                            }}
                                            columnDefs={columnDefs({onCopy, revokeInvitation})}
                                            rowData={invitations}
                                            onGridReady={onGridReady}
                                            colResizeDefault={"shift"}
                                            animateRows={true}
                                            floatingFilter={false}
                                            pagination={true}
                                            pivotPanelShow="always"
                                            paginationPageSize={20}
                                            resizable={true}
                                            enableRtl={context.state.direction === "rtl"}
                            />
                                    )}
                                </ContextLayout.Consumer>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
    )
}

export default UserInvitations
