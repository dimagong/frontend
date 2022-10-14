import React from "react";

import { NmpCheckbox, NmpInput } from "features/nmp-ui";

import { DFormLabel } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormLabel";
import { DFormSelectWidget } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormSelectWidget";

const GroupProperties = ({ element, onElementChange, onGroupSectionChange, data }) => {
  const onNameChange = ({ target }) => onElementChange({ ...element, name: target.value });

  const onProtectedChange = ({ target }) => onElementChange({ ...element, isProtected: target.checked });

  const onSectionChange = (value) => onGroupSectionChange(element.id, element.sectionId, value.value);

  return (
    <>
      <div className="mb-2">
        <DFormLabel label="Group name" id="group-name" />
        <NmpInput id="group-name" type="text" value={element.name} placeholder="Group name" onChange={onNameChange} />
      </div>

      <DFormSelectWidget
        id="group-section"
        label="Element section"
        value={{ value: element.sectionId, label: data.sections[element.sectionId].name }}
        options={Object.values(data.sections).map((section) => ({
          value: section.id,
          label: section.name,
        }))}
        isRequired={false}
        isDisabled={false}
        isLabelShowing={true}
        placeholder="Select an Group section"
        onChange={onSectionChange}
        className="mb-2"
      />

      <NmpCheckbox id="group-protected" checked={element.isProtected} onChange={onProtectedChange}>
        <DFormLabel label="Is protected" />
      </NmpCheckbox>
    </>
  );
};

export default GroupProperties;
