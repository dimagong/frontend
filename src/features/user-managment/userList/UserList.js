import React, {useState, useEffect} from "react"
import {
  Card,
  CardBody,
  Row,
  Col,
} from "reactstrap"
import { ChangeDetectionStrategyType } from 'ag-grid-react/lib/changeDetectionService'
import {ContextLayout} from "utility/context/Layout"
import {AgGridReact} from "ag-grid-react"
import { columnDefs } from "./gridSettings";
import { getUsersRequest, setUser } from "app/slices/appSlice";
import { useDispatch, useSelector } from "react-redux";
import {
    selectManager,
    selectManagers,
  } from "app/selectors/userSelectors";

const UserList = () => {
    const [gridApi, setGridApi] = useState(null);
    const managers = useSelector(selectManagers);
    const manager = useSelector(selectManager);
    const dispatch = useDispatch();

    useEffect(() => {
      !manager && gridApi && clearGridSelection();
    }, [manager])


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
        dispatch(setUser(selectedRow));
      };

      const clearGridSelection = () => {
        gridApi.deselectAll();
        gridApi.clearFocusedCell();
      };

    
      // TODO: END - AG GRID API

    return (
        <Row className="app-user-list">
        <Col sm="12">
          <Card>
            <CardBody>
              <div className="ag-theme-material ag-grid-table">
                  <ContextLayout.Consumer>
                    {context => (
                      <AgGridReact
                            rowDataChangeDetectionStrategy={ChangeDetectionStrategyType.IdentityCheck}
                            className="aggrid-hide-pagination"
                        gridOptions={{}}
                        rowSelection="multiple"
                        defaultColDef={{ resizable: true }}
                        columnDefs={columnDefs}
                        rowData={managers}
                        onGridReady={onGridReady}
                        colResizeDefault={"shift"}
                        animateRows={true}
                        floatingFilter={false}
                        pagination={true}
                        pivotPanelShow="always"
                        paginationPageSize={20}
                        resizable={true}
                        onSelectionChanged={onSelectionChanged}
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

export default UserList
