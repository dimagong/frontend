import React from 'react'
import {Card, CardBody, CardImg, CardText, CardTitle} from 'reactstrap'
import noneAvatar from 'assets/img/portrait/none-avatar.png'

const UserCardTemplate = ({ onClick, ...manager }) => (
  <Card
    key={manager.email}
    className="flex-row flex-wrap home__card cursor-pointer"
    onClick={(e) => {
      if (e.ctrlKey) {

      }
      onClick(manager)

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
)

export default UserCardTemplate;
