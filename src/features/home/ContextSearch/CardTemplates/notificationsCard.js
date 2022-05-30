import React from "react";
import { Card, CardBody, CardImg, CardText, CardTitle, Col } from "reactstrap";
import noneAvatar from "assets/img/portrait/none-avatar.png";

const NotificationTemplate = ({ oneColumn, onClick, ...notification }) => (
  <Col sm={oneColumn ? "12" : "6"}>
    <Card
      key={notification.id}
      className="flex-row flex-wrap home__card cursor-pointer"
      onClick={(e) => {
        onClick(e, notification);
      }}
    >
      <CardImg variant="top" src={noneAvatar} className="round user-nav d-sm-flex d-none" />
      <CardBody>
        <CardTitle>{notification.name}</CardTitle>
        <CardText>{notification.description ? `${notification.description}` : "No description"}</CardText>
      </CardBody>
    </Card>
  </Col>
);

export default NotificationTemplate;
