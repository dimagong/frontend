import React, {useState, useRef, useEffect} from 'react'
import {
  Card,

  CardBody,

  Row,
  Col,

  TabPane,
  Button,
  TabContent,

} from "reactstrap"
import DataTable from "react-data-table-component"

import { Plus } from "react-feather"

import { useDispatch, useSelector } from "react-redux";
import {
  selectManager,
  selectModules,
  selectUserDForms,
  selectUserWorkfows, selectUserReviewers
} from "app/selectors";
import {
  setManager,
  updateUserRequest,
  getRolesRequest,
  getGroupsRequest,
  setContext,
  setManagerOnboarding, getUserOnboardingRequest
} from "app/slices/appSlice";
import {useOutsideAlerter} from 'hooks/useOutsideAlerter'

import {columnDefs} from '../userOnboarding/gridSettings'
import UserOnboardingForm from '../userOnboarding/UserOnboardingForm'
import UserOnboardingDForm from '../userOnboarding/UserOnboardingDForm'

import UserCardTemplate from 'features/home/ContextSearch/CardTemplates/userCard'
import CustomTabs from 'components/Tabs'
import Timeline from 'components/Timeline'
import UserRoles from 'components/UserRoles'
import {selectUserOrganizations} from 'app/selectors/userSelectors'

const tabs = ["Activity", "Master Schema", "Applications", "Permissions"];

const UserEdit = (props, context) => {
  const dispatch = useDispatch();

  const manager = useSelector(selectManager);
  const modules = useSelector(selectModules);
  const dForms = useSelector(selectUserDForms)
  const workflows = useSelector(selectUserWorkfows)
  const reviewers = useSelector(selectUserReviewers)
  const userOrganizations = useSelector(selectUserOrganizations(manager.id))


  const [editField, setEditField] = useState(null);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("1")
  const [activeModuleTab, setActiveModuleTab] = useState(userOrganizations.length ? tabs[0] : tabs[3])

  const titleRef = useRef(null);
  const validUntilRef = useRef(null)
  const numberRef = useRef(null)
  const emailRef = useRef(null)

  const isCreate = useRef(false)

  const initOnboarding = {
    d_form: null,
    is_internal: false,
    reviewers: [],
    user_id: manager.id,
    workflow: null,
  }

  const isOnboarding = () => manager && modules.length && manager.modules.find((module) => module.name === 'Onboarding')

  const isUserHasModules = manager && manager.modules && manager.modules.length > 0;

  const createViewOnboarding = () => {
    dispatch(setManagerOnboarding(initOnboarding));
    isCreate.current = true;
  }

  const handleRowClick = (onboarding) => {
    dispatch(setManagerOnboarding(onboarding));
    isCreate.current = false;
  }

  useEffect(() => {
    if (!dForms.length && !reviewers.length && !workflows.length) {
    }
    // user onboarding
    dispatch(getUserOnboardingRequest({userId: manager.id}))
  }, [manager.groups]);

  useOutsideAlerter([titleRef, validUntilRef, numberRef, emailRef], () => setEditField(null));


  const handleManager = (managerValue) => {
    dispatch(setManager({ ...manager, ...managerValue }));
  };

  const editFieldClose = () => {
    setEditField(null)
  }
  const editFieldSave = () => {
    setEditField(null)
    dispatch(updateUserRequest(manager))
  }

  const removeCard = () => {
    dispatch(setContext(null))
    dispatch(setManager(null));

  }


  const formSubmit =() => {
      // dispatch(createUserOnboardingRequset())
  }

    return (
      <Row className="user-managment">
        <Col sm="12" md="12" lg="12" xl="6">
          <UserCardTemplate className="mb-2" oneColumn={false} onClick={() => {}} {...manager}/>
          <CustomTabs
            active={activeModuleTab}
            onChange={setActiveModuleTab}
            tabs={tabs}
          />
          <TabContent activeTab={activeModuleTab}>
            <TabPane tabId="Activity">
              <Timeline />
            </TabPane>
            <TabPane tabId="Master Schema">
              <Card>
                <CardBody style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "rgba(112,112,112,0.5)",
                  textAlign: "center",
                  padding: "50px 0",
                }}>
                  Coming soon
                </CardBody>
              </Card>
            </TabPane>
            <TabPane tabId="Applications">
              <Card>
                <CardBody>
                  <Row className="mx-0" col="12">
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
                              backgroundColor: '#7367f0',
                              color: 'white'
                            }),
                          }
                        ]}
                        noHeader
                      />
                    </Col>
                    <Col md="12" className="ml-0 pl-0">
                      <div className="onboarding-create" onClick={createViewOnboarding}>
                        <Button
                          onClick={() => {}}
                          className="action-button"
                        >
                          <Plus size={22}/>
                        </Button>
                        <div>
                          Create new onboarding
                        </div>
                      </div>
                      {/*<div className="d-flex justify-content-end flex-wrap mt-2">*/}
                      {/*  <Button className="mt-1" color="primary" onClick={createViewOnboarding}>Create</Button>*/}
                      {/*</div>*/}
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </TabPane>
            <TabPane tabId="Permissions">
              <UserRoles manager={manager} userOrganizations={userOrganizations} />
            </TabPane>
          </TabContent>


          {/*<Card className={"card-action user-managment__edit"}>*/}
            {/*<CardHeader className="user-managment__edit_header">*/}
            {/*  <CardTitle className="font-weight-bold">*/}
            {/*    <div className="d-flex edit-btn-trigger">*/}
            {/*      <div className="user-managment__edit_header_user-info-container" ref={titleRef}>*/}
            {/*        {*/}
            {/*          editField === "name" ?*/}
            {/*            <FormGroup className="position-absolute input-divider-right user-managment__edit_header_form" >*/}
            {/*              <Input*/}
            {/*                autoFocus*/}
            {/*                type="text"*/}
            {/*                name="name"*/}
            {/*                id="mobileVertical"*/}
            {/*                placeholder="Mobile"*/}
            {/*                value={manager.first_name}*/}
            {/*                onChange={(event) => handleManager({first_name: event.target.value})}*/}
            {/*                {...{invalid: errors['name'] }}*/}
            {/*              />*/}
            {/*              <div className="form-control-position input-divider-right user-managment__edit_header_form_check"*/}
            {/*                   onClick={editFieldSave}>*/}
            {/*                <Check className="bg-hover-icon" size={15}/>*/}
            {/*              </div>*/}
            {/*              <div className="form-control-position input-divider-right user-managment__edit_header_form_cross"*/}
            {/*                   onClick={editFieldClose}>*/}
            {/*                <X className="bg-hover-icon" size={15}/>*/}
            {/*              </div>*/}
            {/*              <FormFeedback>{errors['name'] ? errors['name'] : ''}</FormFeedback>*/}
            {/*            </FormGroup>*/}
            {/*            : <div onClick={() => setEditField('name')}>{manager.first_name} <Edit2 className="edit-btn" size={15}/></div>*/}
            {/*        }*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </CardTitle>*/}
            {/*  <X size={15} onClick={removeCard}/>*/}
            {/*</CardHeader>*/}
            {/*  */}
            {/*<CardBody className="user-managment__edit_body">*/}

            {/*  {isUserHasModules && (*/}
            {/*    <Row>*/}
            {/*      <Col>*/}
            {/*        <Nav tabs className="mt-2">*/}
            {/*          <NavItem>*/}
            {/*            <NavLink*/}
            {/*              className={classnames({*/}
            {/*                active: activeTab === "1"*/}
            {/*              })}*/}
            {/*              onClick={() => {*/}
            {/*                setActiveTab("1")*/}
            {/*              }}*/}
            {/*            >*/}
            {/*              <User size={16}/>*/}
            {/*              <span className="align-middle ml-50">Onboarding</span>*/}
            {/*            </NavLink>*/}
            {/*          </NavItem>*/}
            {/*        </Nav>*/}
            {/*        <TabContent activeTab={activeTab}>*/}
            {/*          <TabPane tabId="1">*/}
            {/*            <Row className="mx-0" col="12">*/}
            {/*              <Col md="12" className="ml-0 pl-0">*/}
            {/*                <div className="d-flex justify-content-end flex-wrap mt-2">*/}
            {/*                  <Button className="mt-1" color="primary" onClick={createViewOnboarding}>Create</Button>*/}
            {/*                </div>*/}
            {/*              </Col>*/}
            {/*              <Col md="12" className="ml-0 pl-0">*/}
            {/*                <DataTable*/}
            {/*                  data={manager.onboardings}*/}
            {/*                  columns={columnDefs}*/}
            {/*                  Clicked*/}
            {/*                  onRowClicked={handleRowClick}*/}
            {/*                  conditionalRowStyles={[*/}
            {/*                    {*/}
            {/*                      when: row => manager.onboarding ? row.id === manager.onboarding.id : false,*/}
            {/*                      style: row => ({*/}
            {/*                        backgroundColor: '#007bff',*/}
            {/*                        color: 'white'*/}
            {/*                      }),*/}
            {/*                    }*/}
            {/*                  ]}*/}
            {/*                  noHeader*/}
            {/*                />*/}
            {/*              </Col>*/}

            {/*            </Row>*/}
            {/*          </TabPane>*/}
            {/*        </TabContent>*/}
            {/*      </Col>*/}
            {/*    </Row>*/}
            {/*  )}*/}
            {/*</CardBody>*/}
          {/*</Card>*/}
        </Col>
        <Col xs="6">
          <Card>
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

          </Card>
        </Col>
      </Row>
    )
}

export default UserEdit
