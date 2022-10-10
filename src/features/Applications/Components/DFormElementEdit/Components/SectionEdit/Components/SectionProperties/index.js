import React from "react";

import { DFormTextWidget } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormTextWidget";
import { DFormBooleanWidget } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormBooleanWidget";

const SectionProperties = ({ element, onElementChange }) => {
  const onNameChange = (name) => onElementChange({ ...element, name });

  const onProtectedChange = (isProtected) => onElementChange({ ...element, isProtected });

  return (
    <>
      <DFormTextWidget
        id="section-name"
        label="Section name"
        value={element.name}
        isRequired={false}
        isDisabled={false}
        isLabelShowing={true}
        placeholder="Section name"
        onChange={onNameChange}
        className="mb-2"
      />

      <DFormBooleanWidget
        id="section-protected"
        label="Is protected"
        value={element.isProtected}
        isRequired={false}
        isDisabled={false}
        isLabelShowing={true}
        onChange={onProtectedChange}
      />
    </>
  );
};

export default SectionProperties;
