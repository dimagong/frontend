import React from 'react'
import {Card, CardBody, CardImg, CardText, CardTitle, Col} from 'reactstrap'
import noneAvatar from 'assets/img/portrait/none-avatar.png'

import useWindowSize from 'hooks/windowWidth'
import './userCard.scss'

const UserCardTemplate = ({getOrganizationName, oneColumn, onClick, ...manager }) => (
  <Card
    key={manager.email}
    className="flex-row home__card cursor-pointer user-card"
    onClick={(e) => {
      onClick(e, manager)
    }}
  >
    <CardImg variant="top" src={noneAvatar} className="user-card-img d-sm-flex d-none" />
    <CardBody className="user-card-body">
      <div className="user-card-body-left">
        <CardTitle className="m-0 user-card-body_title">{`${manager.first_name} ${manager.last_name}`}</CardTitle>
        <CardText style={{marginBottom: "5px"}}>
          {manager.roles && manager.roles.length && manager.roles.map((role) => role + " ") || "No roles"}
        </CardText>
        <CardText>
          <span style={{paddingRight: "6px"}}>E:</span> {manager.email ? `${manager.email}` : "email is empty"}
        </CardText>
        <CardText>
          M: {manager.number ? `${manager.number}` : "phone number is empty"}
        </CardText>
      </div>
      <div className="user-card-body-right">
        <CardText>
          {(manager.groups && manager.groups.length > 0 && manager.groups.map((group) => <span className="organization-name">{getOrganizationName(group.group_id, group.group_type)}</span> ))}
        </CardText>
        <CardText className="user-card-body_last-seen">
          Last seen 3 days ago
        </CardText>
      </div>
    </CardBody>
  </Card>
)

export default UserCardTemplate;
