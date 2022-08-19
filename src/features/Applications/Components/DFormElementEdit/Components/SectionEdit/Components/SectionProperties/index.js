import React from 'react';

import TextWidget from 'components/FormCreate/Custom/TextWidget'

import './styles.scss';

const SectionProperties = ({element, onElementChange}) => {

  const handleNameChange = (value) => {
    onElementChange({
      ...element,
      // id: value, //TODO add id change. Currently it leads to update bug cause each new id counts like a new section instead of updating old one
      name: value,
    })
  };

  return (
    <div>
      <TextWidget value={element.name} label={"Section name"} placeholder={"Section name"} onChange={handleNameChange} />
    </div>
  )
};

export default SectionProperties;
