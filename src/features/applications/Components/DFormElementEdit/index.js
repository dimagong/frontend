import "./styles.scss";

import { Row, Col } from "reactstrap";
import React, { useState, useEffect } from "react";

import { DformElementTypes } from "features/dform/data/models";

import GroupEdit from "./Components/GroupEdit";
import FieldEdit from "./Components/FieldEdit";
import SectionEdit from "./Components/SectionEdit";

const EditOptions = {
  styling: "Styling",
  properties: "Properties",
  dynamicRendering: "Dynamic rendering",
};

const ElementTypeSpecificEditOptions = {
  [DformElementTypes.Block]: [EditOptions.properties, EditOptions.styling, EditOptions.dynamicRendering],
  [DformElementTypes.Group]: [EditOptions.properties, EditOptions.dynamicRendering],
  [DformElementTypes.Section]: [EditOptions.properties, EditOptions.dynamicRendering],
};

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

  const [selectedEditOption, setSelectedEditOption] = useState(EditOptions.properties);

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
    handleEditOptionSelect(EditOptions.properties);
  }, [element?.id]);

  return (
    <Row className="dform-element-edit">
      <Col className="col-8">
        <div className="pb-2">
          {
            {
              group: (
                <GroupEdit {...commonProps} editOptions={EditOptions} onGroupSectionChange={onGroupSectionChange} />
              ),
              section: <SectionEdit {...commonProps} editOptions={EditOptions} />,
              field: (
                <FieldEdit
                  {...commonProps}
                  organization={organization}
                  editOptions={EditOptions}
                  onFieldGroupChange={onFieldGroupChange}
                />
              ),
            }[element.elementType]
          }
        </div>
      </Col>
      <Col className="col-4 dform-element-edit_options">
        {ElementTypeSpecificEditOptions[element.elementType].map((option) => (
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
