import React from 'react';
import Select, {components} from 'react-select';
import {ChevronUp, ChevronDown} from "react-feather";

export const DropdownIndicator = props => {
  return components.DropdownIndicator && (
    <components.DropdownIndicator {...props}>
      {props.selectProps.menuIsOpen ? <ChevronUp /> : <ChevronDown />}
    </components.DropdownIndicator>
  )
};


const colorStyles = {
  control: styles => ({
    ...styles,
    backgroundColor: "white",
    border: 0,
    borderRadius: "8px",
    // This line disable the blue border
    boxShadow: "0px 2px 4px 0px rgba(34, 60, 80, 0.2)",
    minHeight: "auto",
    cursor: "pointer",
    padding: "0 15px 0 7px",
    fontSize: "16px",
    fontFamily: "Montserrat",
  }),
  placeholder: (styles) => ({
    ...styles,
    color: "#4B484D",
  }),
  input: (styles) => ({
    ...styles,

    padding: "10px 7px 10px 0",
  }),

  indicatorSeparator: () => ({display: 'none'}),
};

const SurveySelectComponent = ({value, onChange, options}) => {

  return (
    <Select
      components={{DropdownIndicator:  DropdownIndicator,}}
      value={value}
      maxMenuHeight={200}
      isMulti={false}
      isClearable={false}
      styles={colorStyles}
      options={options}
      onChange={onChange}
      classNamePrefix="select"
      id="organizations"
    />
  )
};

export default SurveySelectComponent;
