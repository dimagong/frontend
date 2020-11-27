import React from 'react'
import {Card, CardBody, CardImg, CardText, CardTitle, Col} from 'reactstrap'
import noneAvatar from 'assets/img/portrait/none-avatar.png'

import useWindowSize from 'hooks/windowWidth'
import './userCard.scss'
import {capitalizeAll} from '../../../../utility/common'

const UserCardTemplate = ({className, oneColumn, onClick, ...manager }) => (
  <div>
    <Card
      key={manager.email}
      className={"flex-row home__card cursor-pointer user-card " + className}
      onClick={(e) => {
        onClick(e, manager)
      }}
    >
      <CardImg variant="top" src={noneAvatar} className="user-card-img d-sm-flex d-none" />
      <CardBody className="user-card-body">
        <div className="user-card-body-left">
          <div>
            <CardTitle className="m-0 user-card-body_title">{`${manager.first_name} ${manager.last_name}`}</CardTitle>
            <CardText style={{marginBottom: "5px"}}>
              {manager?.permissions?.ability && capitalizeAll(manager.permissions.ability.replace("_", " "))}
            </CardText>
          </div>
          <div>
            <CardText>
              <span style={{paddingRight: "6px"}}>E:</span> {manager.email ? `${manager.email}` : "email is empty"}
            </CardText>
            <CardText>
              M: {manager.number ? `${manager.number}` : "phone number is empty"}
            </CardText>
          </div>
        </div>
        <div className="user-card-body-right">
          <CardText>
            {manager.permissions?.organization}
          </CardText>
          <CardText className="user-card-body_last-seen">
            {/*Last seen 3 days ago*/}
          </CardText>
        </div>
      </CardBody>
    </Card>
  </div>
)

export default UserCardTemplate;
