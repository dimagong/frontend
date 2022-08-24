import "./styles.scss";

import { Row, Col, Button } from "reactstrap";
import React, { useState, useEffect } from "react";

import GroupEdit from "./Components/GroupEdit";
import SectionEdit from "./Components/SectionEdit";
import FieldEdit from "./Components/FieldEdit";

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
        <div className="application_delimiter" />
        <div className="d-flex justify-content-between">
          <Button onClick={onElementChangesCancel} className="button button-cancel">
            Cancel
          </Button>
          <div>
            <Button color="danger" onClick={onDeleteButtonClick} className="mr-1 button button-danger">
              Delete
            </Button>
            <Button color="primary" onClick={onElementChangesSave} className="button button-success">
              Save
            </Button>
          </div>
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
