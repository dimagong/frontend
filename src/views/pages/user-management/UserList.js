import React from "react"
import {
  Card,
  CardBody,
  Row,
  Col,
  Badge
} from "reactstrap"
import {ContextLayout} from "../../../utility/context/Layout"
import {AgGridReact} from "ag-grid-react"
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../assets/scss/pages/users.scss"
import UserService from '../../../services/user.service'
import {connect} from "react-redux"
import {setUserList} from '../../../redux/actions/user/userActions'
import {bindActionCreators} from "redux"
import {setEditUser} from '../../../redux/actions/user-management/userEditActions'

class UsersList extends React.Component {
  state = {
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
      suppressSizeToFit: false,
      resizable: true,
    },
    searchVal: "",
    columnDefs: [
      {
        headerName: "Name",
        field: "name",
        width: 200
      },
      {
        headerName: "Email",
        field: "email",
        width: 250
      },
      {
        headerName: "Phone number",
        field: "number",
        width: 200
      },
      {
        headerName: "Roles",
        field: "roles",
        width: 200,
        cellRendererFramework: params => {
          return params.value.map(next => (
            <Badge color="primary" style={{margin: '1px'}}>
              {next}
            </Badge>
          ))
        }
      },
      // {
      //     headerName: "Status",
      //     field: "status",
      //     width: 150,
      //     cellRendererFramework: params => {
      //         return params.value === "active" ? (
      //             <div className="badge badge-pill badge-light-success">
      //                 {params.value}
      //             </div>
      //         ) : params.value === "inactive" ? (
      //             <div className="badge badge-pill badge-light-danger">
      //                 {params.value}
      //             </div>
      //         ) : params.value === "suspended" ? (
      //             <div className="badge badge-pill badge-light-warning">
      //                 {params.value}
      //             </div>
      //         ) : null
      //     }
      // },
      // {
      //     headerName: "Actions",
      //     field: "transactions",
      //     width: 150,
      //     cellRendererFramework: params => {
      //         return (
      //             <div className="actions cursor-pointer">
      //                 <Edit
      //                     className="mr-50"
      //                     size={15}
      //                     onClick={() => {
      //                         let selectedData = this.gridApi.getSelectedRows();
      //                         const user = selectedData[0];
      //                         this.props.setEditUser(user);
      //                     }
      //                     }
      //                 />
      //                 <Trash2
      //                     size={15}
      //                     onClick={() => {
      //                         let selectedData = this.gridApi.getSelectedRows();
      //                         selectedData.forEach(async (user) => {
      //                             await UserService.remove(user.id)
      //                         });
      //                         this.gridApi.updateRowData({ remove: selectedData })
      //                     }}
      //                 />
      //             </div>
      //         )
      //     }
      // }
    ]
  }

  async componentDidMount() {
    this.getUserByEmail();
  }

  componentDidUpdate(prevProps) {
    if (this.props.userEditing.id !== prevProps.userEditing.id && this.props.userEditing.id === -1) {
      this.gridApi.deselectAll();
      this.gridApi.clearFocusedCell();
    }
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();

    window.addEventListener('resize', () => {
      this.gridApi.sizeColumnsToFit();
    });
  };

  async getUserByEmail() {
    const response = await UserService.getByEmail(null, 1)
    const users = response.data.data;
    const total = response.data.meta.total;
    this.props.setUserList(users, {...this.props.nav, total});
  }

  filterSize = val => {
    if (this.gridApi) {
      this.gridApi.paginationSetPageSize(Number(val));
      this.setState({
        pageSize: val
      })
    }
  };

  async getUserById(id) {
    const response = await UserService.getUserById(id);
    return response.data.data;
  }

  onSelectionChanged = async (params) => {
    var selectedRows = params.api.getSelectedRows();
    const user = selectedRows[0];
    const refreshUser = await this.getUserById(user.id);
    this.props.setEditUser(refreshUser);
  };

  render() {
    const {columnDefs, defaultColDef, pageSize} = this.state
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
                {this.props.users !== null ? (
                  <ContextLayout.Consumer>
                    {context => (
                      <AgGridReact
                        gridOptions={{}}
                        rowSelection="multiple"
                        defaultColDef={defaultColDef}
                        columnDefs={columnDefs}
                        rowData={this.props.users}
                        onGridReady={this.onGridReady}
                        colResizeDefault={"shift"}
                        animateRows={true}
                        floatingFilter={false}
                        pagination={true}
                        pivotPanelShow="always"
                        paginationPageSize={pageSize}
                        resizable={true}
                        onSelectionChanged={this.onSelectionChanged}
                        enableRtl={context.state.direction === "rtl"}
                      />
                    )}
                  </ContextLayout.Consumer>
                ) : null}
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
    users: state.user.list.data,
    nav: state.user.list.nav,
    userEditing: state.userManagement.userEditing
  }
}
const mapActionsToProps = (dispatch) => {
  return {
    setUserList: bindActionCreators(setUserList, dispatch),
    setEditUser: bindActionCreators(setEditUser, dispatch)
  }
}
export default connect(mapStateToProps, mapActionsToProps)(UsersList)
