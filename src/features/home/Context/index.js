import React from "react";

import UserEdit from "features/user/userEdit/UserEdit";
import UserCreate from "features/user/userCreate/UserCreate";
import UserInvitations from "features/user/userInvitations/UserInvitations";
import NotificationsForm from "features/notification/NotificationsForm";
import WorkflowForm from "features/workflow/WorkflowForm";
import Organization from "features/organization";
import SurveysDesigner from "features/surveys/SurveysDesigner";
import Dashboard from "../ContextSearch/Dashboard";
import MemberFirmsContainer from "../ContextSearch/MemberFirms";
import MasterSchema from "../../masterSchema";
import ResourceManager from "../../resourceManager";
import { ApplicationsPage, CreateApplicationPage } from "features/applications";

const Context = ({ selectedContext }) => {
  if (!selectedContext) return null;

  return {
    User: <UserEdit />,
    "Create user": <UserCreate />,
    Invitations: <UserInvitations />,
    "Create notification": <NotificationsForm isCreate={true} />,
    Notification: <NotificationsForm isCreate={false} />,
    "Create dForm": <CreateApplicationPage />,
    dForm: <ApplicationsPage />,
    "Create workflow": <WorkflowForm workflowModalType="Create" />,
    WorkFlow: <WorkflowForm workflowModalType="Edit" />,
    Organization: <Organization />,
    OrganizationCreate: <Organization create />,
    Survey: <SurveysDesigner />,
    Dashboard: <Dashboard />,
    "Member Firms": <MemberFirmsContainer />,
    MasterSchema: <MasterSchema />,
    resourceManager: <ResourceManager />,
  }[selectedContext];
};

export default Context;
