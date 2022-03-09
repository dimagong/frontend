import { map } from "rxjs";
import React, {useState, useRef, useEffect} from 'react'
import {
  Card,
  CardBody,
  Row,
  Col,
  TabPane,
  TabContent,
} from "reactstrap";
import { Scrollbars } from "react-custom-scrollbars";

import Select from 'react-select';

import _ from "lodash"

import { Plus } from "react-feather"

import { useDispatch, useSelector } from "react-redux";
import {
  selectManager,
  selectUserDForms,
  selectUserWorkflows,
  selectUserReviewers,
} from "app/selectors";

import UserOnboardingForm from '../userOnboarding/UserOnboardingForm'
import UserOnboardingDForm from '../userOnboarding/UserOnboardingDForm'

import UserCardTemplate from 'features/home/ContextSearch/CardTemplates/userCard'
import CustomTabs from 'components/Tabs'
import Timeline from 'components/Timeline'
import UserRoles from 'components/UserRoles'
import UserProfileEdit from './UserEditContextFeature'
import SurveyAssign from './components/Survey/SurveyAssign'
import AssignedSurvey from './components/Survey/AssignedSurvey';

import {
  selectUserOrganizations,
  selectCurrentManager,
  selectSelectedManagerAssignedSurveys, selectUserActivity,
} from 'app/selectors/userSelectors'

import { useAsync } from "hooks/useAsync";
import { RoleBdmService } from "api/roleBdm/roleBdmService";

import appSlice from 'app/slices/appSlice'
import { CustomTable } from './components/CustomTable/CustomTable';

import { INPUT_HEADER_HEIGHT } from "constants/header";

import { UserManagementScopeContextFeature } from "./components/ManagementScope";
import UserMasterSchemaProvider from "./components/MasterSchema/UserMasterSchemaProvider";
import { UserMasterSchemaContext, UserMasterSchemaContextFeature } from "./components/MasterSchema";

const {
  setManagerOnboarding,
  getUserOnboardingRequest,
  updateActivitiesRequest,
  getAssignedSurveysRequest,
  getActivitiesRequest
}  = appSlice.actions;

const selectStyles = {
  control: styles => ({
    ...styles,
    backgroundColor: "white",
    border: "1px solid rgba(34, 60, 80, 0.2)",
    borderRadius: "8px",
    // This line disable the blue border
    boxShadow: "none",
    minHeight: "auto",
    cursor: "pointer",
    padding: "0 0 0 7px",
    fontSize: "11px",
    fontFamily: "Montserrat",
  }),
  menu: provided => ({ ...provided, zIndex: 9999 }),
  placeholder: (styles) => ({
    ...styles,
    color: "#4B484D",
  }),
  input: (styles) => ({
    ...styles,

    padding: "6px 7px 6px 0",
  }),

  indicatorSeparator: () => ({display: 'none'}),
};

const selectOptions = [
  {
    label:"Onboarding",
    value:"onboarding",
  },
  {
    label:"Survey",
    value:"survey",
  },
];

const fetchBdmSubordinates$ = ({ userId }) =>
  RoleBdmService.getBdmSubordinates$({ userId }).pipe(map((response) => response.data));

const UserEdit = () => {
  const dispatch = useDispatch();

  //* TODO refactor, old manager is used
  const selectedManager = useSelector(selectManager);

  //* TODO add fetch user by id since we are going to add pagination and wouldn't have all users fetched

  const manager = useSelector(selectCurrentManager);
  const [tabs, setTabs] = React.useState([]);

  const dForms = useSelector(selectUserDForms);
  const workflows = useSelector(selectUserWorkflows);
  const reviewers = useSelector(selectUserReviewers);
  const userOrganizations = useSelector(selectUserOrganizations(manager.id));
  const assignedSurveys = useSelector(selectSelectedManagerAssignedSurveys) || [];
  const activity = useSelector(selectUserActivity(manager.id));

  const [contextFeature, setContextFeature] = useState("");
  const [openOnboarding, setOpenOnboarding] = useState('');
  const [selectedAssignedSurvey, setSelectedAssignedSurvey] = useState(null);
  const [applicationAddSelectValue, setApplicationAddSelectValue] = useState(selectOptions[0]);

  const [activeModuleTab, setActiveModuleTab] = useState(manager.permissions ? tabs[0] : tabs[3]);
  const isCreate = useRef(false);

  const initOnboarding = {
    d_form: null,
    is_internal: false,
    reviewers: [],
    user_id: manager.id,
    workflow: null,
  };

  const createViewOnboarding = () => {
    dispatch(setManagerOnboarding(initOnboarding));
    isCreate.current = true;
    setContextFeature("onboarding")
  };

  const setMasterSchemaContextFeature = React.useCallback(() => setContextFeature("masterSchema"), []);
  const setManagementScopeContextFeature = React.useCallback(() => setContextFeature("managementScope"), []);

  const handleRowClick = (application) => {
    if (application.questions) {
      setSelectedAssignedSurvey(application);
      dispatch(setManagerOnboarding(null));
      setContextFeature("assignedSurvey")
    } else {
      setSelectedAssignedSurvey(null);
      dispatch(setManagerOnboarding(application));
      isCreate.current = false;
      setContextFeature("onboarding")
    }
  };

  const [{ data: members, IsLoading: isMembersLoading }, run] = useAsync({ useObservable: true });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => void run(fetchBdmSubordinates$({ userId: manager.id })).subscribe(), [manager.id]);

  useEffect(() => {
    if (!dForms.length && !reviewers.length && !workflows.length) {
    }
    // user onboarding
    dispatch(getUserOnboardingRequest({userId: manager.id}))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manager.groups]);

  useEffect(() => {
    setActiveModuleTab(manager.permissions ? tabs[0] : tabs[3]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manager.id]);

  useEffect(() => {
    dispatch(getAssignedSurveysRequest(manager.id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manager.id]);

  React.useEffect(() => {
    if (members && members.length !== 0) {
      setTabs(["Activity", "Master Schema", "Applications", "Permissions", "Management scope"]);
    } else {
      setTabs(["Activity", "Master Schema", "Applications", "Permissions"]);
    }
  }, [members]);

  const handleEdit = () => {
    setContextFeature("edit")
  };

  const handleEditClose = () => {
    setContextFeature('')
  };

  const handleChangeTab = (data) => {
    setActiveModuleTab(data);
    if (data === "Activity") {
      dispatch(updateActivitiesRequest({managerId: manager.id, page: 1}))
    }
    if (data === "Management scope") {
      setManagementScopeContextFeature();
    }
  };

  const handleSurveyAssign = () => {
    setContextFeature("surveyCreate")
  };

  const handleApplicationAdd = () => {
    if (applicationAddSelectValue.value === "survey") {
      handleSurveyAssign()
    } else {
      createViewOnboarding()
    }
  };

  const loadMoreData = () => {
    dispatch(getActivitiesRequest({managerId: manager.id, page: activity.current_page + 1, shouldUpdate: true}))
  }

  const handleSurveyClose = () => {
    setContextFeature(null);
    setSelectedAssignedSurvey(null)
  };

  useEffect(() => {
    switch (selectedManager.selectedInfo?.type) {
      case 'onboarding': {
        setActiveModuleTab(tabs[2]);
        if (selectedManager.selectedInfo?.value) {
          setContextFeature('onboarding');
          setOpenOnboarding(selectedManager.selectedInfo.value);
        }
        break;
      }
      case 'userEdit': {
        setContextFeature('edit');
        setActiveModuleTab(tabs[0]);
        break;
      }
      default: {
        setContextFeature('');
        setOpenOnboarding('');
        setActiveModuleTab(tabs[0]);
      }
    }
  }, [selectedManager.selectedInfo, tabs]);

  useEffect(() => {
    if (!selectedManager.onboarding && openOnboarding && manager.onboardings.length > 0) {
      dispatch(setManagerOnboarding(manager.onboardings.find(item => item.d_form.name === selectedManager.selectedInfo.value)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manager.onboardings, openOnboarding]);

  const tableData = _.sortBy([...manager.onboardings, ...assignedSurveys], function(application) {
    return new Date(application.created_at);
  });

  useEffect(() => {
    dispatch(getActivitiesRequest({managerId: manager.id, page: 1, shouldUpdate: false}))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manager?.id]);

  return (
    <Row className="user-managment">
      <UserMasterSchemaProvider user={manager} setContextFeature={setMasterSchemaContextFeature}>
        <Col sm="12" md="12" lg="12" xl="6" className="pb-3">
          <Scrollbars autoHeight autoHeightMin={550} autoHeightMax={window.innerHeight - INPUT_HEADER_HEIGHT}>
            <div style={{paddingRight: "15px"}}>
              <UserCardTemplate
                className="mb-2"
                oneColumn={false}
                onClick={() => {}}
                onEdit={handleEdit}
                {...manager}
                editable
              />

              <CustomTabs
                active={activeModuleTab}
                onChange={handleChangeTab}
                tabs={tabs}
              />
              <TabContent activeTab={activeModuleTab}>
                <TabPane tabId="Activity">
                  <Timeline
                    managerId={manager.id}
                    loadMoreData={loadMoreData}
                    activity={activity}
                  />
                </TabPane>
                <TabPane tabId="Master Schema">
                  {activeModuleTab === "Master Schema" ? <UserMasterSchemaContext key={manager.id} /> : null}
                </TabPane>
                <TabPane tabId="Applications">
                  <Card>
                    <CardBody>
                      <Row className="mx-0" col="12">
                        <Col md="12" className="ml-0 pl-0">

                          <CustomTable
                            handleRowClick={handleRowClick}
                            selectedManager={selectedManager}
                            selectedAssignedSurvey={selectedAssignedSurvey}
                          />

                        </Col>
                        <Col md="12" className="ml-0 pl-0">
                          {!!tableData.length ? (
                            <div className="application-create-container">
                              <div className="application-create-container_select">
                                <Select
                                  options={selectOptions}
                                  value={applicationAddSelectValue}
                                  onChange={setApplicationAddSelectValue}
                                  styles={selectStyles}
                                  isSearchable={false}
                                />
                              </div>
                              <button onClick={handleApplicationAdd}>
                                <Plus />
                              </button>
                            </div>
                          ) : (
                            <div className="onboarding-create">
                              <div>
                                Create new&nbsp;
                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,no-script-url */}
                                <a onClick={createViewOnboarding} href="javascript:void(0);">onboarding</a>
                                &nbsp;or&nbsp;
                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,no-script-url */}
                                <a onClick={handleSurveyAssign} href="javascript:void(0);">survey</a>
                              </div>
                            </div>
                          )}

                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </TabPane>
                <TabPane tabId="Permissions">
                  <UserRoles manager={manager} userOrganizations={userOrganizations} />
                </TabPane>
                <TabPane tabId="managementScope" />
              </TabContent>
            </div>
          </Scrollbars>
        </Col>

        <Col sm="12" md="12" lg="12" xl="6">
          <Scrollbars autoHeightMin={550} autoHeight autoHeightMax={window.innerHeight - INPUT_HEADER_HEIGHT}>
            <div style={{paddingRight: "15px"}}>
              {{
                'edit': <UserProfileEdit manager={manager} onEditClose={handleEditClose} />,
                'onboarding': (
                  selectedManager.onboarding && (
                    <div className="onboarding-create-feature">
                      <div className="onboarding-create-feature_header">
                        {isCreate.current ? (
                          <div className="onboarding-create-feature_header_title">
                            Onboarding Create
                          </div>
                        ) : (
                          <>
                            <div className="onboarding-create-feature_header_title">
                              Application
                            </div>
                            <div className="onboarding-create-feature_header_name">
                              {selectedManager?.onboarding?.d_form?.name || ""}
                            </div>
                          </>

                        )}
                      </div>
                      <Card>
                        <UserOnboardingForm isCreate={isCreate}/>
                        {!isCreate.current && (
                          <UserOnboardingDForm isManualSave={true} />
                        )}
                      </Card>

                    </div>
                  )
                ),
                'surveyCreate': <SurveyAssign userId={manager.id} />,
                'assignedSurvey': <AssignedSurvey onSurveyClose={handleSurveyClose} selectedSurveyId={selectedAssignedSurvey?.id} />,
                "masterSchema": <UserMasterSchemaContextFeature key={manager.id} />,
                "managementScope": <UserManagementScopeContextFeature user={manager} members={members} isLoading={isMembersLoading} />,
              }[contextFeature]}
            </div>
          </Scrollbars>
        </Col>
      </UserMasterSchemaProvider>
    </Row>
  )
};

export default UserEdit
