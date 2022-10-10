import React from "react";

import { DFormTextWidget } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormTextWidget";
import { DFormSelectWidget } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormSelectWidget";
import { DFormBooleanWidget } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormBooleanWidget";

const GroupProperties = ({ element, onElementChange, onGroupSectionChange, data }) => {
  const onNameChange = (name) => onElementChange({ ...element, name });

  const onProtectedChange = (isProtected) => onElementChange({ ...element, isProtected });

  const onSectionChange = (value) => onGroupSectionChange(element.id, element.sectionId, value.value);

  return (
    <>
      <DFormTextWidget
        id="group-name"
        label="Group name"
        value={element.name}
        isRequired={false}
        isDisabled={false}
        isLabelShowing={true}
        placeholder="Group name"
        onChange={onNameChange}
        className="mb-2"
      />

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

      <DFormBooleanWidget
        id="group-protected"
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

export default GroupProperties;
