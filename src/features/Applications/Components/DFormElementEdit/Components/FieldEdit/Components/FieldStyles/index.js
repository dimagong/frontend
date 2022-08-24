import React from "react";

import { FIELD_TYPES } from "components/DForm/constants";
import SelectWidget from "components/DForm/Components/Fields/Components/DFormWidgets/Components/Select";

import { FIELD_STYLES_CLASSES, MULTI_SELECT_UI_STYLES } from "../../../../../../constants";

const FieldStyles = ({ element, onElementChange }) => {
  const handleElementChange = (property, value) => {
    onElementChange({ ...element, [property]: value });
  };

  const renderSpecificStyles = () => {
    switch (element.type) {
      case FIELD_TYPES.multiSelect: {
        return (
          <SelectWidget
            label={"UI style"}
            options={MULTI_SELECT_UI_STYLES.map((className) => ({ label: className, value: className }))}
            value={{ label: element.uiStyle, value: element.uiStyle }}
            onChange={(value) => handleElementChange("uiStyle", value)}
          />
        );
      }
      default:
        return null;
    }
  };

  return (
    <div>
      <div className={"mb-2"}>
        <SelectWidget
          label={"Classes"}
          options={FIELD_STYLES_CLASSES.map((className) => ({ label: className, value: className }))}
          value={{ label: element.classes, value: element.classes }}
          onChange={(value) => handleElementChange("classes", value)}
        />
      </div>
      {renderSpecificStyles()}
    </div>
  );
};

export default FieldStyles;
