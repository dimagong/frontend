import React from "react";
import SelectWidget from "components/DForm/Components/Fields/Components/DFormWidgets/Components/Select";
import { FIELD_STYLES_CLASSES } from "../../../../../../constants";

const FieldStyles = ({ element, onElementChange }) => {
  const handleElementChange = (property, value) => {
    onElementChange({ ...element, [property]: value });
  };

  return (
    <div>
      <div>
        <SelectWidget
          label={"Classes"}
          options={FIELD_STYLES_CLASSES.map((className) => ({ label: className, value: className }))}
          value={{ label: element.classes, value: element.classes }}
          onChange={(value) => handleElementChange("classes", value)}
        />
      </div>
    </div>
  );
};

export default FieldStyles;
