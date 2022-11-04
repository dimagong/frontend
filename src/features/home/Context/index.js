import React from "react";
import { useSelector } from "react-redux";

import UserEdit from "features/user/userEdit/UserEdit";
import UserCreate from "features/user/userCreate/UserCreate";
import UserInvitations from "features/user/userInvitations/UserInvitations";
import NotificationsForm from "features/onboarding/notifications/NotificationsForm";
import WorkflowForm from "features/onboarding/workflow/components/WorkflowForm";
import Organization from "features/organization";
import SurveysDesigner from "features/surveys/SurveysDesigner";
import Dashboard from "../ContextSearch/Dashboard";
import MemberFirmsContainer from "../ContextSearch/MemberFirms";
import MasterSchema from "../../masterSchema";
import ResourceManager from "../../resourceManager";
import { ApplicationsPage, CreateApplicationPage } from "features/applications";

const Context = ({ selectedContext }) => {
  const isCSshown = useSelector((state) => state.app.isContextSearchVisible);
  if (!selectedContext) return null;

  return (
    <>
      {!!isCSshown && <div className="delimiter" />}
      <div style={{ paddingTop: isCSshown ? "30px" : "0" }}>
        {
          {
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
          }[selectedContext]
        }
      </div>
    </>
  );
};

export default Context;
