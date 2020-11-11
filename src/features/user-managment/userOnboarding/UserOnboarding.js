import React, {useState, useRef, useEffect} from 'react'
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
  import { selectGroups, selectRoles, selectModules, selectManager, selectUserDForms, selectUserWorkfows, selectUserReviewers } from "app/selectors";
  import { useDispatch, useSelector } from "react-redux";
  import classnames from "classnames"
  import DataTable, {createTheme} from "react-data-table-component"
  import {User, X, Check, Plus, Edit2, RefreshCw, EyeOff, Eye} from "react-feather"
import {columnDefs} from './gridSettings';
import UserOnboardingForm from './UserOnboardingForm';
import { setManagerOnboarding, getUserOnboardingRequest} from 'app/slices/appSlice'
import UserOnboardingDForm from './UserOnboardingDForm';



const UserOnboarding = () => {
    const [activeTab, setActiveTab] = useState("1")
    const manager = useSelector(selectManager);
    const modules = useSelector(selectModules);
    const dForms = useSelector(selectUserDForms)
    const workflows = useSelector(selectUserWorkfows)
    const reviewers = useSelector(selectUserReviewers)
    const isCreate = useRef(false)
    const dispatch = useDispatch();

    const initOnboarding = {
      d_form: null,
      is_internal: false,
      reviewers: [],
      user_id: manager.id,
      workflow: null,
}
  useEffect(()=>{
    if(!dForms.length && !reviewers.length && !workflows.length){
    } dispatch(getUserOnboardingRequest())
  }, [])

    const isOnboarding = () => manager && modules.length && manager.modules.find((module) => module.name === 'Onboarding')

    const createViewOnboarding = () => {
      dispatch(setManagerOnboarding(initOnboarding));
      isCreate.current = true;
    }

    const handleRowClick = (onboarding) => {
      dispatch(setManagerOnboarding(onboarding));
      isCreate.current = false;
    }

    return ( isOnboarding()
        ?
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
                        onRowClicked={handleRowClick}
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
                    </Col>
                    {
                        manager.onboarding
                        ? <UserOnboardingForm isCreate={isCreate}/>
                        : null
                    }
                    {
                      manager.onboarding && !isCreate.current
                      ? <UserOnboardingDForm />
                      : null
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
