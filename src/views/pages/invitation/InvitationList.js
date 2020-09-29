import React from 'react'
import {
    Card,
    CardBody,
    Row,
    Col,
    Button
} from "reactstrap"
import { ContextLayout } from "../../../utility/context/Layout"
import { AgGridReact } from "ag-grid-react"
import {
    Archive,
} from "react-feather"
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../assets/scss/pages/users.scss"
import InvitationService from '../../../services/invitation.service'
import moment from 'moment';
import { connect } from "react-redux"
import { setEditUser } from '../../../redux/actions/user-management/userEditActions'
import { setUserList } from '../../../redux/actions/user/userActions'
import { setInvitationsList } from '../../../redux/actions/user-management/InvitationsActions'
import { bindActionCreators } from "redux"
import { store } from '../../../redux/storeConfig/store'
import UserService from '../../../services/user.service'
import { CopyToClipboard } from "react-copy-to-clipboard"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../../assets/scss/plugins/extensions/toastr.scss"

class InvitationList extends React.Component {
    state = {
        rowData: null,
        pageSize: 20,
        isVisible: true,
        reload: false,
        collapse: true,
        status: "Opened",
        role: "All",
        selectStatus: "All",
        verified: "All",
        department: "All",
        defaultColDef: {
            sortable: true,
            resizable: true,
            suppressSizeToFit: false,
        },
        searchVal: "",
        columnDefs: [
            // {
            //     headerName: "ID",
            //     field: "id",
            //     width: 100,
            //     suppressSizeToFit: false,
            // },
            {
                headerName: "Status",
                field: "revoked_at",
                width: 150,
                cellRendererFramework: (params) => {
                    return !params.value && !params.data.accepted_at ? (
                        <div className="badge badge-pill badge-light-success">
                            active
                        </div>
                    ) :
                        <div className="badge badge-pill badge-light-danger">
                            { params.value ? 'Revoked' : params.data.accepted_at ? 'Accepted' : 'Active' }
                        </div>

                },
                suppressSizeToFit: false,
            },
            {
                headerName: "Invitation link",
                field: "invitation_token",
                width: 200,
                cellRendererFramework: params => {
                    return <CopyToClipboard
                        onCopy={this.onCopy}
                        text={window.location.origin + '/invitation-accept/' + params.value}
                    >
                        <Button.Ripple size="sm" color="primary">Copy link</Button.Ripple>
                    </CopyToClipboard>

                    //return <Link to={'/api/invitation/' + params.value}>{params.value}</Link>
                },
                suppressSizeToFit: false,
            },
            // {
            //     headerName: "Invited by",
            //     field: "invited_by_user",
            //     width: 200,
            //     cellRendererFramework: params => {
            //         return <Link to={`/user/${params.value.id}/edit`}>{params.value.name}</Link>
            //     },
            //     suppressSizeToFit: false,
            // },
            {
                headerName: "Invited user",
                field: "invited_user",
                width: 200,
                cellRendererFramework: params => {
                    return params.value.first_name + ' ' + params.value.last_name;
                    // return <Link to={`/user/${params.value.id}/edit`}>{params.value.name}</Link>
                },
                suppressSizeToFit: false,
            },
            {
                headerName: "Accepted at",
                field: "accepted_at",
                width: 200,
                cellRendererFramework: params => {
                    return params.value ? moment(params.value).format('YYYY-MM-DD HH:mm:ss') : 'Not set';
                },
                suppressSizeToFit: false,
            },
            // {
            //     headerName: "Revoked at",
            //     field: "revoked_at",
            //     width: 250,
            //     cellRendererFramework: params => {
            //         return params.value ? moment(params.value).format('YYYY-MM-DD HH:mm:ss') : 'Not set';
            //     },
            //     suppressSizeToFit: false,
            // },
            // {
            //     headerName: "Revoked note",
            //     field: "revoked_note",
            //     width: 250,
            //     cellRendererFramework: params => {
            //         return params.value ? params.value : 'Empty';
            //     },
            //     suppressSizeToFit: false,
            // },
            {
                headerName: "Created at",
                field: "created_at",
                width: 200,
                cellRendererFramework: params => {
                    return params.value ? moment(params.value).format('YYYY-MM-DD HH:mm:ss') : 'Not set';
                },
                suppressSizeToFit: false,
            },
            {
                headerName: "Actions",
                field: "transactions",
                width: 150,
                cellRendererFramework: params => {
                    return (
                        <div className="actions cursor-pointer">
                            <Archive
                                size={15}
                                onClick={() => { this.revokeInvitation() }}
                            />
                        </div>
                    )
                },
                suppressSizeToFit: false,
            }
        ]
    }

    async componentDidMount() {
        this.getInitialData();
    }

    onCopy() {
        toast.success("Invitation link copied successfully", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000
        })
    }

    componentWillUpdate() {
        this.gridApi && this.gridApi.sizeColumnsToFit();
    }

    revokeInvitation = () => {
        let selectedData = this.gridApi.getSelectedRows();
        let timeoutRefresh = null;
        selectedData.forEach(async (invitation) => {
            clearTimeout(timeoutRefresh);
            await InvitationService.revoke(invitation.id);
            this.dispatchEditUser();
            this.dispatchUserList();
            timeoutRefresh = setTimeout(() => { this.getInitialData() }, 100);
        });
    }

    getInitialData = async () => {
        let response = await InvitationService.getAll();
        let rowData = response.data.data;
        this.props.setInvitationsList(rowData);
    }

    onGridReady = (params) => {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit();
        setTimeout(() => {
            this.gridApi.sizeColumnsToFit();
        }, 1000);
        window.addEventListener('resize', () => {
            this.gridApi.sizeColumnsToFit();
        });
    }

    dispatchUserList = async () => {
        const nav = store.getState().user.list.nav;
        const response = await UserService.getByEmail(nav.searchVal, nav.currPage);
        const users = response.data.data;
        this.props.setUserList(users, nav);
    }

    dispatchEditUser = async () => {
        const userId = store.getState().userManagement.userEditing.id;
        if (userId > 0) {
            const response = await UserService.getUserById(userId);
            const user = response.data.data;
            store.dispatch(setEditUser(user));
        }
    }

    filterData = (column, val) => {
        var filter = this.gridApi.getFilterInstance(column)
        var modelObj = null
        if (val !== "all") {
            modelObj = {
                type: "equals",
                filter: val
            }
        }
        filter.setModel(modelObj)
        this.gridApi.onFilterChanged()
    }

    filterSize = val => {
        if (this.gridApi) {
            this.gridApi.paginationSetPageSize(Number(val))
            this.setState({
                pageSize: val
            })
        }
    }
    updateSearchQuery = val => {
        this.gridApi.setQuickFilter(val)
        this.setState({
            searchVal: val
        })
    }

    refreshCard = () => {
        this.setState({ reload: true })
        setTimeout(() => {
            this.setState({
                reload: false,
                role: "All",
                selectStatus: "All",
                verified: "All",
                department: "All"
            })
        }, 500)
    }

    render() {
        const { columnDefs, defaultColDef, pageSize } = this.state
        return (
            <Row className="app-user-list">
                <Col sm="12">
                    <Card>
                        <CardBody>
                            <div className="ag-theme-material ag-grid-table">
                                {/* <div className="ag-grid-actions d-flex justify-content-between flex-wrap mb-1">
                                    <div className="sort-dropdown">
                                        <UncontrolledDropdown className="ag-dropdown p-1">
                                            <DropdownToggle tag="div">
                                                1 - {pageSize} of 150
                        <ChevronDown className="ml-50" size={15} />
                                            </DropdownToggle>
                                            <DropdownMenu right>
                                                <DropdownItem
                                                    tag="div"
                                                    onClick={() => this.filterSize(20)}
                                                >
                                                    20
                        </DropdownItem>
                                                <DropdownItem
                                                    tag="div"
                                                    onClick={() => this.filterSize(50)}
                                                >
                                                    50
                        </DropdownItem>
                                                <DropdownItem
                                                    tag="div"
                                                    onClick={() => this.filterSize(100)}
                                                >
                                                    100
                        </DropdownItem>
                                                <DropdownItem
                                                    tag="div"
                                                    onClick={() => this.filterSize(150)}
                                                >
                                                    150
                        </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div> */}
                                <ContextLayout.Consumer>
                                    {context => (
                                        <AgGridReact
                                            gridOptions={{}}
                                            rowSelection="multiple"
                                            defaultColDef={defaultColDef}
                                            columnDefs={columnDefs}
                                            rowData={this.props.invitations}
                                            onGridReady={this.onGridReady}
                                            colResizeDefault={"shift"}
                                            animateRows={true}
                                            floatingFilter={false}
                                            pagination={true}
                                            pivotPanelShow="always"
                                            paginationPageSize={pageSize}
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
}

const mapStateToProps = state => {
    return {
        invitations: state.userManagement.invitations.list
    }
}
const mapActionsToProps = (dispatch) => {
    return {
        setUserList: bindActionCreators(setUserList, dispatch),
        setInvitationsList: bindActionCreators(setInvitationsList, dispatch)
    }
}
export default connect(mapStateToProps, mapActionsToProps)(InvitationList)
