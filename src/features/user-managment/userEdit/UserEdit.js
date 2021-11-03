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

import Select from 'react-select';

import _ from "lodash"

import { Plus } from "react-feather"

import { handleMasterSchemaDataExport } from "services/files.service";

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

import appSlice from 'app/slices/appSlice'
import { CustomTable } from './components/CustomTable/CustomTable';

const {
  setManagerOnboarding,
  getUserOnboardingRequest,
  updateActivitiesRequest,
  getAssignedSurveysRequest,
  getActivitiesRequest
}  = appSlice.actions;

const tabs = ["Activity", "Master Schema", "Applications", "Permissions"];

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

const UserEdit = (props, context) => {
  const dispatch = useDispatch();

  //* TODO refactor, old manager is used
  const selectedManager = useSelector(selectManager);

  //* TODO add fetch user by id since we are going to add pagination and wouldn't have all users fetched

  const manager = useSelector(selectCurrentManager);

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

  useEffect(() => {
    if (!dForms.length && !reviewers.length && !workflows.length) {
    }
    // user onboarding
    dispatch(getUserOnboardingRequest({userId: manager.id}))
  }, [manager.groups]);

  useEffect(() => {
    setActiveModuleTab(manager.permissions ? tabs[0] : tabs[3]);
  }, [manager.id]);

  useEffect(() => {
    dispatch(getAssignedSurveysRequest(manager.id))
  }, [manager.id]);

  const handleEdit = () => {
    setContextFeature("edit")
  };

  const handleEditClose = () => {
    setContextFeature('')
  };

  const handleUserMasterSchemaExport = () => {
    handleMasterSchemaDataExport(
      `${manager.first_name} ${manager.last_name}`,
      manager.permissions.organization_type,
      manager.permissions.organization_id,
      manager.id
    ).then(() => {})
  };

  const handleChangeTab = (data) => {
    setActiveModuleTab(data);
    if (data === 'Activity') {
      dispatch(updateActivitiesRequest({managerId: manager.id, page: 1}))
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
  }, [selectedManager.selectedInfo]);

  useEffect(() => {
    if (!selectedManager.onboarding && openOnboarding && manager.onboardings.length > 0) {
      dispatch(setManagerOnboarding(manager.onboardings.find(item => item.d_form.name === selectedManager.selectedInfo.value)));
    }
  }, [manager.onboardings, openOnboarding]);

  const tableData = _.sortBy([...manager.onboardings, ...assignedSurveys], function(application) {
    return new Date(application.created_at);
  });

  useEffect(() => {
    dispatch(getActivitiesRequest({managerId: manager.id, page: 1, shouldUpdate: false}))
  }, [manager?.id]);

  return (
    <Row className="user-managment">
      <Col sm="12" md="12" lg="12" xl="6" className="pb-3">
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
            <Card>
              <CardBody style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "rgba(112,112,112,0.5)",
                textAlign: "center",
                padding: "50px 0",
              }}>
                <div style={{marginBottom: "15px"}}>
                  Coming soon
                </div>
                {!!userOrganizations.length && (
                  <div>
                    <Button color={"primary"} onClick={handleUserMasterSchemaExport}>
                      Export MS Data in csv
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
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
                          <a onClick={createViewOnboarding} href="javascript:void(0);">onboarding</a>
                          &nbsp;or&nbsp;
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
        </TabContent>
      </Col>


      <Col sm="12" md="12" lg="12" xl="6">
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
                      <UserOnboardingDForm />
                    )}
                  </Card>

                </div>
              )
          ),
          'surveyCreate': <SurveyAssign userId={manager.id} />,
          'assignedSurvey': <AssignedSurvey onSurveyClose={handleSurveyClose} selectedSurveyId={selectedAssignedSurvey?.id} />
        }[contextFeature]}


      </Col>
    </Row>
  )
};

export default UserEdit
