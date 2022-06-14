import React, { useState } from "react";

import { Row, Col, Button } from "reactstrap";

import GroupEdit from "./Components/GroupEdit";
import SectionEdit from "./Components/SectionEdit";
import FieldEdit from "./Components/FieldEdit";

import "./styles.scss";

import { EDIT_OPTIONS } from "../../constants";

const DFormElementEdit = ({
  element,
  onElementChange,
  onElementChangesSave,
  onElementChangesCancel,
  organization,
  onElementDelete,
}) => {
  const [selectedEditOption, setSelectedEditOption] = useState(EDIT_OPTIONS.properties);

  const handleEditOptionSelect = (editOption) => {
    setSelectedEditOption(editOption);
  };

  const commonProps = {
    editProperty: selectedEditOption,
    element: element,
    onElementChange: onElementChange,
  };

  return (
    <Row className="dform-element-edit">
      <Col className="col-8">
        <div className={"pb-2"}>
          {
            {
              group: <GroupEdit {...commonProps} />,
              section: <SectionEdit {...commonProps} />,
              field: <FieldEdit {...commonProps} organization={organization} />,
            }[element.elementType]
          }
        </div>

        <div className="d-flex justify-content-between">
          <Button onClick={onElementChangesCancel} className={"button button-white"}>
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
        {Object.values(EDIT_OPTIONS).map((option) => {
          //TODO remove hot fix with normal solution
          if (["group", "section"].includes(element.elementType) && option === EDIT_OPTIONS.styling) {
            return null;
          }

          return (
            <div
              className={`dform-element-edit_options-option ${option === selectedEditOption ? "selected" : ""}`}
              onClick={() => handleEditOptionSelect(option)}
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
