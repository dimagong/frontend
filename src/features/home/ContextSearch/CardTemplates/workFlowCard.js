import React from 'react'
import {Card, CardBody, CardImg, CardText, CardTitle} from 'reactstrap'
import noneAvatar from 'assets/img/portrait/none-avatar.png'

const WorkFlowTemplate = ({onClick, ...workFlow}) => (
  <Card
    key={workFlow.id}
    className="flex-row flex-wrap home__card"
    onClick={() => {onClick(workFlow)}}
  >
    <CardImg variant="top" src={noneAvatar} className="round user-nav d-sm-flex d-none" />
    <CardBody>
      <CardTitle>{workFlow.name}</CardTitle>
      <CardText>
        {workFlow.description ? `${workFlow.description}` : "No description"}
      </CardText>
    </CardBody>
  </Card>
)

export default WorkFlowTemplate;
