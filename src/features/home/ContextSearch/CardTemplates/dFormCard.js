import React from 'react'
import {Card, CardBody, CardImg, CardText, CardTitle} from 'reactstrap'
import noneAvatar from 'assets/img/portrait/none-avatar.png'

const DFormCardTemplate = ({ onClick, ...dForm }) => (
  <Card
    key={dForm.id}
    className="flex-row flex-wrap home__card cursor-pointer"
    onClick={() => {onClick(dForm)}}
  >
    <CardImg variant="top" src={noneAvatar} className="round user-nav d-sm-flex d-none" />
    <CardBody>
      <CardTitle>{dForm.name}</CardTitle>
      <CardText>
        {dForm.description ? `${dForm.description}` : "No description"}
      </CardText>
    </CardBody>
  </Card>
)

export default DFormCardTemplate;
