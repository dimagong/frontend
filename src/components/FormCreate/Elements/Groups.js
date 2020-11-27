import React from "react";
import {Row} from "reactstrap";

export default function Groups(props) {

  const {key, GroupIsHidden, groupName} = props;

  return <div className="border px-2" key={key} style={GroupIsHidden}>
    <div className="title pt-2 pb-0">
      <span className="text-bold-500 font-medium-2 ml-50">{groupName}</span>
      <hr/>
    </div>
    <Row>
      {props.children}
    </Row>
  </div>
}
