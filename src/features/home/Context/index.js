import React from 'react'

import {Card, CardBody, Col, Row} from 'reactstrap'

import UserEdit from 'features/user-managment/userEdit/UserEdit'
import UserCreate from 'features/user-managment/userCreate/UserCreate'
import UserInvitations from 'features/user-managment/userInvitations/UserInvitations'
import NotificationsForm from 'features/onboarding/notifications/NotificationsForm'
import DFormForm from 'features/onboarding/dForm/DFormForm'
import WorkflowForm from 'features/onboarding/workflow/components/WorkflowForm'

const Context = ({ selectedContext }) => {

  if(!selectedContext) return null;

  return (
    <>
      {{
        "User": <UserEdit />,
        "Create user": <UserCreate />,
        "Invitations": <UserInvitations />,
        "Create notification": <NotificationsForm isCreate={true} />,
        "Notification": <NotificationsForm isCreate={false} />,
        "Create dForm": <DFormForm isCreate={true} />,
        "dForm": <DFormForm isCreate={false} />,
        "Create workflow": <WorkflowForm workflowModalType="Create" />,
        "WorkFlow": <WorkflowForm workflowModalType="Edit" />,
        // "MasterSchema":
      }[selectedContext]}
    </>
  )
}

export default Context;
