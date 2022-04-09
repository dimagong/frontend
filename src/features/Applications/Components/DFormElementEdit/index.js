import React, { useState, } from 'react';

import {Row, Col, Button} from 'reactstrap'

import GroupEdit from "./Components/GroupEdit";
import SectionEdit from "./Components/SectionEdit";
import FieldEdit from "./Components/FieldEdit";

import './styles.scss'

const EDIT_OPTIONS = [ "Properties", "Styling", "Dynamic rendering"];

const DFormElementEdit = ({ element }) => {

  const [selectedEditOption, setSelectedEditOption] = useState(EDIT_OPTIONS[0]);


  const handleEditOptionSelect = (editOption) => {
    setSelectedEditOption(editOption)
  };

  const commonProps = {
    editProperty: selectedEditOption,
    element: element,
  };

  return (
    <Row className="dform-element-edit">
      <Col className="col-8">
        {{
          "group": <GroupEdit {...commonProps} />,
          "section": <SectionEdit {...commonProps} />,
          "field": <FieldEdit {...commonProps} />
        }[element.type]}
      </Col>
      <Col className="col-4 dform-element-edit_options">
        {EDIT_OPTIONS.map((option) => (
          <div className={`dform-element-edit_options-option ${option === selectedEditOption ? "selected" : ""}`} onClick={() => handleEditOptionSelect(option)}>
            {option}
          </div>
        ))}
      </Col>

    </Row>
  )
};

export default DFormElementEdit;
