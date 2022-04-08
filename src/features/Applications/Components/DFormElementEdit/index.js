import React, { useState, } from 'react';

import {Row, Col, Button} from 'reactstrap'

import './styles.scss'

const EDIT_OPTIONS = [ "Properties", "Styling", "Dynamic rendering"];

const DFormElementEdit = () => {

  const [selectedEditOption, setSelectedEditOption] = useState(EDIT_OPTIONS[0]);


  const handleEditOptionSelect = (editOption) => {
    setSelectedEditOption(editOption)
  };

  return (
    <Row className="dform-element-edit">
      <Col className="col-8">
        test
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
