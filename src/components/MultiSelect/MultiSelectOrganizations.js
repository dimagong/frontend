import React, {useState} from "react";
import Select, {components} from "react-select";
import {DropdownIndicator, colourStyles} from '../../utility/select/selectSettigns'

export function MultiSelectOrganization(props) {
  const selectRef = React.createRef();

  const handleMultiValueClick = (e, innerProps) => {
    props.onSelectElement && props.onSelectElement({name: innerProps.data.label, ...innerProps.data.value});
    selectRef.current.select.blur();
  };

  const MultiValueLabel = props => {
    return (
      <div onClick={e => handleMultiValueClick(e, props)}>
        <components.MultiValueLabel {...props} />
      </div>
    );
  };

  return (
    <Select
      closeMenuOnSelect={true}
      components={{MultiValueLabel, DropdownIndicator}}
      isMulti
      openMenuOnClick={false}
      ref={selectRef}
      styles={colourStyles}
      maxMenuHeight={200}
      isClearable={false}
      className="fix-margin-select"
      classNamePrefix="select"
      {...props}
    />
  );
}
