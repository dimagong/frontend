import React from 'react'
import {Card, CardBody, CardImg, CardText, CardTitle, Col} from 'reactstrap'
import noneAvatar from 'assets/img/portrait/none-avatar.png'

const DFormCardTemplate = ({oneColumn, onClick, ...dForm }) => (
  <Col sm={oneColumn ? "12" : "6"}>
    <Card
      key={dForm.id}
      className="flex-row flex-wrap home__card cursor-pointer"
      onClick={(e) => {onClick(e, dForm)}}
    >
      <CardImg variant="top" src={noneAvatar} className="round user-nav d-sm-flex d-none" />
      <CardBody>
        <CardTitle>{dForm.name}</CardTitle>
        <CardText>
          {dForm.description ? `${dForm.description}` : "No description"}
        </CardText>
      </CardBody>
    </Card>
  </Col>
)

export default DFormCardTemplate;
