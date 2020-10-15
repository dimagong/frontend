import React, {useState, useEffect, useRef} from "react"
import {
  Card,
  CardBody,
  Row,
  Col,
  Spinner,
} from "reactstrap"
import { ChangeDetectionStrategyType } from 'ag-grid-react/lib/changeDetectionService'
import {ContextLayout} from "utility/context/Layout"
import {AgGridReact} from "ag-grid-react"
import { columnDefs } from "./gridSettings";
import { getUsersRequest, setManager } from "app/slices/appSlice";
import { useDispatch, useSelector } from "react-redux";
import {
    selectManager,
    selectManagers,
  } from "app/selectors/userSelectors";
  ;
const UserList = () => {
    const [gridApi, setGridApi] = useState(null);
    const managers = useSelector(selectManagers);
    const manager = useSelector(selectManager);
    const dispatch = useDispatch();
    const isFirstRender = useRef(true)

    useEffect(() => {
      !manager && gridApi && clearGridSelection();
    }, [manager])

    useEffect(() => {
      if(!managers.length && gridApi && isFirstRender){
        setTimeout(()=>gridApi.showLoadingOverlay(),0)
        isFirstRender.current = false
      }else if(managers.length && gridApi && !isFirstRender){
        setTimeout(()=>gridApi.hideOverlay(),0)
      }else if(!managers.length && gridApi && isFirstRender){
        setTimeout(()=>{
          gridApi.hideOverlay();
          gridApi.showNoRowsOverlay();
        },0)
      }
    }, [managers,gridApi])

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
        dispatch(setManager(selectedRow));
      };

      const clearGridSelection = () => {
        gridApi.deselectAll();
        gridApi.clearFocusedCell();
      };

      const CustomLoadingOverlay= () => (
        <div
        className="ag-overlay-loading-center"
    >
      <Spinner/>
    </div>
      )

      const CustomNoRowsOverlay= () => (
        <div
        className="ag-overlay-loading-center"
    >
      <p>No Rows to Show</p>
    </div>
      )
    
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
                        defaultColDef={{
                          sortable: true,
                          suppressSizeToFit: false,
                          resizable: true,
                        }}
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
                        frameworkComponents={{
                          customLoadingOverlay: CustomLoadingOverlay,
                          customNoRowsOverlay: CustomNoRowsOverlay,
                        }}
                        loadingOverlayComponent={'customLoadingOverlay'}
                        
                        noRowsOverlayComponent={'customNoRowsOverlay'}
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
