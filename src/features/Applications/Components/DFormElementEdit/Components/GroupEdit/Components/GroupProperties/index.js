import React from 'react';
import TextWidget from "../../../../../../../../components/FormCreate/Custom/TextWidget";

const GroupProperties = ({ element, onElementChange}) => {

  const handleNameChange = (value) => {
    onElementChange({
      ...element,
      // id: value, //TODO add id change. Currently it leads to update bug cause each new id counts like a new group instead of updating old one
      name: value,
    })
  };

  return (
    <div>
      <TextWidget value={element.name} label={"Group name"} placeholder={"Group name"} onChange={handleNameChange} />
    </div>
  )
};

export default GroupProperties;
