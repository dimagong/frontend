import React from "react";

import { NmpCheckbox, NmpInput } from "features/nmp-ui";

import { DFormLabel } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormLabel";

const SectionProperties = ({ element, onElementChange }) => {
  const onNameChange = ({ target }) => onElementChange({ ...element, name: target.value });

  const onProtectedChange = ({ target }) => onElementChange({ ...element, isProtected: target.checked });

  return (
    <>
      <div className="mb-2">
        <DFormLabel label="Section name" id="section-name" />
        <NmpInput
          id="section-name"
          type="text"
          value={element.name}
          placeholder="Section name"
          onChange={onNameChange}
        />
      </div>

      <NmpCheckbox id="section-protected" checked={element.isProtected} onChange={onProtectedChange}>
        <DFormLabel label="Is protected" />
      </NmpCheckbox>
    </>
  );
};

export default SectionProperties;
