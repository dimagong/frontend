import React from "react";

import { FIELD_STYLES_CLASSES, MULTI_SELECT_UI_STYLES } from "features/Applications/constants";

import { FieldTypes } from "components/DForm/constants";
import { DFormSelectWidget } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormSelectWidget";

const defaultUIStyle = { label: "default", value: null };

const uIStylesOptions = [defaultUIStyle, ...MULTI_SELECT_UI_STYLES.map((value) => ({ label: value, value }))];

const FieldStyles = ({ element, onElementChange }) => {
  const handleElementChange = (property, value) => {
    onElementChange({ ...element, [property]: value });
  };

  const handleUIStyleChange = ({ value }) => handleElementChange("uiStyle", value);

  const renderSpecificStyles = () => {
    switch (element.type) {
      case FieldTypes.MultiSelect: {
        return (
          <DFormSelectWidget
            id="ui-style"
            label="UI style"
            value={element.uiStyle ? { label: element.uiStyle, value: element.uiStyle } : defaultUIStyle}
            options={uIStylesOptions}
            isError={false}
            isRequired={false}
            isDisabled={false}
            isLabelShowing={false}
            onChange={handleUIStyleChange}
          />
        );
      }
      default:
        return null;
    }
  };

  return (
    <>
      <div className="mb-2">
        <DFormSelectWidget
          id="classes"
          label="Classes"
          value={{ label: element.classes, value: element.classes }}
          options={FIELD_STYLES_CLASSES.map((className) => ({ label: className, value: className }))}
          isError={false}
          isRequired={false}
          isDisabled={false}
          isLabelShowing={false}
          onChange={({ value }) => handleElementChange("classes", value)}
        />
      </div>
      {renderSpecificStyles()}
    </>
  );
};

export default FieldStyles;
