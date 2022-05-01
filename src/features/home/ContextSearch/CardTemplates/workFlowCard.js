import React from "react";
import { Card, CardBody, CardImg, CardText, CardTitle, Col } from "reactstrap";
import noneAvatar from "assets/img/portrait/none-avatar.png";

const WorkFlowTemplate = ({ oneColumn, onClick, ...workFlow }) => (
  <Col sm={oneColumn ? "12" : "6"}>
    <Card
      key={workFlow.id}
      className="flex-row flex-wrap home__card cursor-pointer"
      onClick={(e) => {
        onClick(e, workFlow);
      }}
    >
      <CardImg variant="top" src={noneAvatar} className="round user-nav d-sm-flex d-none" />
      <CardBody>
        <CardTitle>{workFlow.name}</CardTitle>
        <CardText>{workFlow.description ? `${workFlow.description}` : "No description"}</CardText>
      </CardBody>
    </Card>
  </Col>
);

export default WorkFlowTemplate;
