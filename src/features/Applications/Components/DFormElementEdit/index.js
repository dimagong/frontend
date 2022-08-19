import React, { useState, useEffect } from "react";

import { Row, Col, Button } from "reactstrap";

import GroupEdit from "./Components/GroupEdit";
import SectionEdit from "./Components/SectionEdit";
import FieldEdit from "./Components/FieldEdit";

import "./styles.scss";

import { EDIT_OPTIONS } from "../../constants";

const DFormElementEdit = ({
  data,
  element,
  onElementChange,
  onElementChangesSave,
  onElementChangesCancel,
  organization,
  onElementDelete,
  onFieldGroupChange,
  onGroupSectionChange,
}) => {
  const [selectedEditOption, setSelectedEditOption] = useState(EDIT_OPTIONS.properties);

  const handleEditOptionSelect = (editOption) => {
    setSelectedEditOption(editOption);
  };

  const commonProps = {
    data: data,
    editProperty: selectedEditOption,
    element: element,
    onElementChange: onElementChange,
  };

  useEffect(() => {
    handleEditOptionSelect(EDIT_OPTIONS.properties);
  }, [element.id]);

  return (
    <Row className="dform-element-edit">
      <Col className="col-8">
        <div className={"pb-2"}>
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
          <Button onClick={onElementChangesCancel} className={"button button-cancel"}>
            Cancel
          </Button>
          <div>
            <Button color={"danger"} onClick={() => onElementDelete(element)} className={"mr-1 button button-danger"}>
              Delete
            </Button>
            <Button color={"primary"} onClick={onElementChangesSave} className={"button button-success"}>
              Save
            </Button>
          </div>
        </div>
      </Col>
      <Col className="col-4 dform-element-edit_options">
        {Object.entries(EDIT_OPTIONS).map(([key, option]) => {
          //TODO remove hot fix with normal solution
          if (["group", "section"].includes(element.elementType) && option === EDIT_OPTIONS.styling) {
            return null;
          }

          return (
            <div
              className={`dform-element-edit_options-option ${option === selectedEditOption ? "selected" : ""}`}
              onClick={() => handleEditOptionSelect(option)}
              key={key}
            >
              {option}
            </div>
          );
        })}
      </Col>
    </Row>
  );
};

export default DFormElementEdit;
