import React from 'react'
import {Card, CardBody, CardImg, CardText, CardTitle, Col} from 'reactstrap'
import noneAvatar from 'assets/img/portrait/none-avatar.png'

import useWindowSize from 'hooks/windowWidth'

const UserCardTemplate = ({oneColumn, onClick, ...manager }) => (
  <Col sm={oneColumn ? "8" : "6"} className={oneColumn ? "pull-xs-4" : ""}>
    <Card
      key={manager.email}
      className="flex-row home__card cursor-pointer"
      onClick={(e) => {
        onClick(e, manager)
      }}
    >
      <CardImg variant="top" src={noneAvatar} className="round user-nav d-sm-flex d-none" />
      <CardBody>
        <CardTitle>{`${manager.first_name} ${manager.last_name}`}</CardTitle>
        <CardText>
          {manager.number ? `${manager.number}` : "phone number is empty"}
        </CardText>
        <CardText>
          {manager.email ? `${manager.email}` : "email is empty"}
        </CardText>
      </CardBody>
    </Card>
  </Col>

)

export default UserCardTemplate;
