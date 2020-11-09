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
    <Row>
      <Col sm="12" md="12" lg="12" xl="7">
        <Card>
          <CardBody className="pt-2">
            {{
              "User": <UserEdit />,
              "User create": <UserCreate />,
              "User invitations": <UserInvitations />,
              "Create notification": <NotificationsForm isCreate={true} />,
              "Notification": <NotificationsForm isCreate={false} />,
              "Create dForm": <DFormForm isCreate={true} />,
              "dForm": <DFormForm isCreate={false} />,
              "Create workflow": <WorkflowForm workflowModalType="Create" />,
              "Workflow": <WorkflowForm workflowModalType="Edit" />,
              // "MasterSchema":
            }[selectedContext]}
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

export default Context;
