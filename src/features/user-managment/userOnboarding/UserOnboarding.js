import React, {useState, useRef} from 'react'
import {
    Row,
    Col,
    Button,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
  } from "reactstrap"
  import { selectGroups, selectRoles, selectModules, selectManager } from "app/selectors";
  import { useDispatch, useSelector } from "react-redux";
  import classnames from "classnames"
  import DataTable, {createTheme} from "react-data-table-component"
  import {User, X, Check, Plus, Edit2, RefreshCw, EyeOff, Eye} from "react-feather"
import {columnDefs} from './gridSettings';
// import UserOnboardingCreate from './UserOnboardingCreate';
// import UserOnboardingEdit from './UserOnboardingEdit';

const UserOnboarding = () => {
    const [activeTab, setActiveTab] = useState("1")
    const manager = useSelector(selectManager);
    const modules = useSelector(selectModules);
    const roles = useSelector(selectRoles);
    const groups = useSelector(selectGroups);
    const isCreate = useRef(false)

    const createViewOnboarding = () => {

    }

    return (
        manager && modules.length && manager.modules.find((module) => module.name === 'Onboarding') ?
          <Row>
            <Col>
              <Nav tabs className="mt-2">
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: activeTab === "1"
                    })}
                    onClick={() => {
                        setActiveTab("1")
                    }}
                  >
                    <User size={16}/>
                    <span className="align-middle ml-50">Onboarding</span>
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                  <Row className="mx-0" col="12">
                    <Col md="12" className="ml-0 pl-0">
                      <div className="d-flex justify-content-end flex-wrap mt-2">
                        <Button className="mt-1" color="primary" onClick={createViewOnboarding}>Create</Button>
                      </div>
                    </Col>
                    <Col md="12" className="ml-0 pl-0">
                      <DataTable
                        data={manager.onboardings}
                        columns={columnDefs}
                        Clicked
                        // onRowClicked={handleRowClick}
                        conditionalRowStyles={[
                          {
                            when: row => manager.onboarding ? row.id === manager.onboarding.id : false,
                            style: row => ({
                              backgroundColor: '#007bff',
                              color: 'white'
                            }),
                          }
                        ]}
                        noHeader
                      />
                    </Col>{
                        // manager.onboardings
                        // ? isCreate 
                        //     ? <UserOnboardingCreate/>
                        //     : <UserOnboardingEdit/>
                        // :null
                    }
                    
                  </Row>
                </TabPane>
              </TabContent>
            </Col>
          </Row>
          : null
      );
}

export default UserOnboarding
