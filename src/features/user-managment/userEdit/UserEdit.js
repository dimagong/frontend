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

import { handleMasterSchemaDataExport } from "services/files.service";

import { useDispatch, useSelector } from "react-redux";
import {
  selectManager,
  selectUserDForms,
  selectUserWorkflows,
  selectUserReviewers,
} from "app/selectors";

import {columnDefs} from '../userOnboarding/gridSettings'
import UserOnboardingForm from '../userOnboarding/UserOnboardingForm'
import UserOnboardingDForm from '../userOnboarding/UserOnboardingDForm'

import UserCardTemplate from 'features/home/ContextSearch/CardTemplates/userCard'
import CustomTabs from 'components/Tabs'
import Timeline from 'components/Timeline'
import UserRoles from 'components/UserRoles'
import UserProfileEdit from './UserEditContextFeature'

import { useParams } from 'react-router-dom'

import {
  selectUserOrganizations,
  selectCurrentManager,
  selectManagerById,
} from 'app/selectors/userSelectors'

import appSlice from 'app/slices/appSlice'

const {
  setManagerOnboarding,
  getUserOnboardingRequest,
  updateActivitiesRequest
}  = appSlice.actions;

const tabs = ["Activity", "Master Schema", "Applications", "Permissions"];

const UserEdit = (props, context) => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const newManager = useSelector(selectManagerById(id))

  //* TODO refactor, old manager is used
  const selectedManager = useSelector(selectManager);

  //* TODO add fetch user by id since we are going to add pagination and wouldn't have all users fetched

  const manager = useSelector(selectCurrentManager);

  const dForms = useSelector(selectUserDForms);
  const workflows = useSelector(selectUserWorkflows);
  const reviewers = useSelector(selectUserReviewers);
  const userOrganizations = useSelector(selectUserOrganizations(manager.id));

  const [contextFeature, setContextFeature] = useState("");

  const [activeModuleTab, setActiveModuleTab] = useState(manager.permissions ? tabs[0] : tabs[3]);
  const [activeOnboardingId, setActiveOnboardingId] = useState(-1);
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

  const handleRowClick = (onboarding) => {
    dispatch(setManagerOnboarding(onboarding));
    isCreate.current = false;
    setContextFeature("onboarding")
  };

  useEffect(() => {
    if (!dForms.length && !reviewers.length && !workflows.length) {
    }
    // user onboarding
    dispatch(getUserOnboardingRequest({userId: manager.id}))
  }, [manager.groups]);

  useEffect(() => {
    setActiveModuleTab(manager.permissions ? tabs[0] : tabs[3]);
  }, [manager.id])


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
    setActiveModuleTab(data)
    if (data === 'Activity') {
      dispatch(updateActivitiesRequest({managerId: manager.id, page: 1}))
    }
  }

  return (
    <Row className="user-managment">
      <Col sm="12" md="12" lg="12" xl="6">
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
            <Timeline managerId={manager.id}/>
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
                    <DataTable
                      data={manager.onboardings}
                      columns={columnDefs}
                      Clicked
                      onRowClicked={handleRowClick}
                      conditionalRowStyles={[
                        {
                          when: row => selectedManager.onboarding ? row.id === selectedManager.onboarding.id : false,
                          style: () => ({
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


      <Col xs="6">
        {{
          'edit': <UserProfileEdit manager={manager} onEditClose={handleEditClose} />,
          'onboarding': (
            <Card>
              {selectedManager.onboarding && (
                <>
                  <UserOnboardingForm isCreate={isCreate}/>
                  {!isCreate.current && (
                    <UserOnboardingDForm />
                  )}
                </>
              )}
            </Card>
          ),

        }[contextFeature]}


      </Col>
    </Row>
  )
};

export default UserEdit
