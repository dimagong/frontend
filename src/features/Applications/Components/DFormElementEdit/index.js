import "./styles.scss";

import { Row, Col, Button } from "reactstrap";
import React, { useState, useEffect } from "react";

import GroupEdit from "./Components/GroupEdit";
import FieldEdit from "./Components/FieldEdit";
import SectionEdit from "./Components/SectionEdit";

import { EDIT_OPTIONS, ELEMENT_TYPE_SPECIFIC_EDIT_OPTIONS } from "../../constants";

const DFormElementEdit = (props) => {
  const {
    data,
    element,
    organization,
    onElementChange,
    onElementChangesSave,
    onElementChangesCancel,
    onElementDelete,
    onFieldGroupChange,
    onGroupSectionChange,
    onFieldSubmit,
  } = props;

  const [selectedEditOption, setSelectedEditOption] = useState(EDIT_OPTIONS.properties);

  const handleEditOptionSelect = (editOption) => {
    setSelectedEditOption(editOption);
  };

  const onDeleteButtonClick = () => onElementDelete(element);

  const commonProps = {
    data: data,
    element: element,
    editProperty: selectedEditOption,
    onElementChange: onElementChange,
    onDeleteButtonClick: onDeleteButtonClick,
    onElementChangesSave: onElementChangesSave,
    onElementChangesCancel: onElementChangesCancel,
    onFieldSubmit: onFieldSubmit,
  };

  useEffect(() => {
    handleEditOptionSelect(EDIT_OPTIONS.properties);
  }, [element.id]);

  return (
    <Row className="dform-element-edit">
      <Col className="col-8">
        <div className="pb-2">
          {
            {
              group: <GroupEdit {...commonProps} onGroupSectionChange={onGroupSectionChange} />,
              section: <SectionEdit {...commonProps} />,
              field: <FieldEdit {...commonProps} organization={organization} onFieldGroupChange={onFieldGroupChange} />,
            }[element.elementType]
          }
        </div>
      </Col>
      <Col className="col-4 dform-element-edit_options">
        {ELEMENT_TYPE_SPECIFIC_EDIT_OPTIONS[element.elementType].map((option) => (
          <div
            className={`dform-element-edit_options-option ${option === selectedEditOption ? "selected" : ""}`}
            onClick={() => handleEditOptionSelect(option)}
            key={option}
          >
            {option}
          </div>
        ))}
      </Col>
    </Row>
  );
};

export default DFormElementEdit;
