import React from "react";
import TextWidget from "../../../../../../../../components/FormCreate/Custom/TextWidget";
import FieldLabel from "../../../../../../../../components/DForm/Components/Fields/Components/DFormWidgets/Components/FieldLabel";
import Select from "react-select";
import { colourStyles } from "../../../../../../../../components/DForm/Components/Fields/Components/DFormWidgets/Components/Select";

const GroupProperties = ({ element, onElementChange, onGroupSectionChange, data }) => {
  const handleNameChange = (value) => {
    onElementChange({
      ...element,
      // id: value, //TODO add id change. Currently it leads to update bug cause each new id counts like a new group instead of updating old one
      name: value,
    });
  };

  const handleGroupSectionChange = (value) => {
    onGroupSectionChange(element.id, element.sectionId, value.value);
  };

  return (
    <div>
      <TextWidget value={element.name} label={"Group name"} placeholder={"Group name"} onChange={handleNameChange} />
      <div className={"custom-react-select mt-2"}>
        <FieldLabel label={"Element section"} />
        <Select
          maxMenuHeight={175}
          isDisabled={false}
          styles={colourStyles}
          isMulti={false}
          name="colors"
          value={{ value: element.sectionId, label: data.sections[element.sectionId].name }}
          onChange={handleGroupSectionChange}
          options={Object.values(data.sections).map((section) => ({
            value: section.id,
            label: section.name,
          }))}
          className="React"
          classNamePrefix="select"
          placeholder={"Select an option"}
        />
      </div>
    </div>
  );
};

export default GroupProperties;
