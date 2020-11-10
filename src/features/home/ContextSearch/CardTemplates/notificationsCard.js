import React from 'react'
import {Card, CardBody, CardImg, CardText, CardTitle} from 'reactstrap'
import noneAvatar from 'assets/img/portrait/none-avatar.png'

const NotificationTemplate = ({ onClick, ...notification }) => (
  <Card
    key={notification.id}
    className="flex-row flex-wrap home__card cursor-pointer"
    onClick={() => {onClick(notification)}}
  >
    <CardImg variant="top" src={noneAvatar} className="round user-nav d-sm-flex d-none" />
    <CardBody>
      <CardTitle>{notification.name}</CardTitle>
      <CardText>
        {notification.description ? `${notification.description}` : "No description"}
      </CardText>
    </CardBody>
  </Card>
)

export default NotificationTemplate;
