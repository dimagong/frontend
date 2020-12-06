import React from "react";
import {Row} from "reactstrap";

import './groupsStyles.scss'

export default function Groups(props) {

  const {key, GroupIsHidden, groupName} = props;

  return (
    <div className="group" key={key} style={GroupIsHidden}>
      <div className="group-title pt-2">
        <span className="text-bold-500">{groupName}</span>
      </div>
      <Row className="group-content">
        {props.children}
      </Row>
    </div>
  )
}
