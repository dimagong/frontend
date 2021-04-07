import React from 'react'
import {useSelector} from 'react-redux'


import {Card, CardBody, Col, Row} from 'reactstrap'

import UserEdit from 'features/user-managment/userEdit/UserEdit'
import UserCreate from 'features/user-managment/userCreate/UserCreate'
import UserInvitations from 'features/user-managment/userInvitations/UserInvitations'
import NotificationsForm from 'features/onboarding/notifications/NotificationsForm'
import DFormForm from 'features/onboarding/dForm/DFormForm'
import WorkflowForm from 'features/onboarding/workflow/components/WorkflowForm'
import Organization from 'features/Organization'

const Context = ({ selectedContext }) => {
  const isCSshown = useSelector((state) =>  state.app.isContextSearchVisible)
  if(!selectedContext) return null;

  return (
    <>
      {!!isCSshown && (<div className="delimiter"/>)}
      <div style={{paddingTop: isCSshown ? "30px" : "0"}}>
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
          "Organization": <Organization />,
          "OrganizationCreate": <Organization create />,
        }[selectedContext]}
      </div>
    </>
  )
}

export default Context;