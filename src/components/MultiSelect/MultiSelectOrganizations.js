import React from "react";
import chroma from "chroma-js";
import { Plus } from "react-feather";
import Select, { components } from "react-select";

const DropdownIndicator = (props) => {
  return components.DropdownIndicator ? (
    <components.DropdownIndicator {...props}>
      <Plus className="plus-select" size={15} />
    </components.DropdownIndicator>
  ) : null;
};

const colorMultiSelect = "#007bff";

const colourStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    border: 0,
    // This line disable the blue border
    boxShadow: "none",
    minHeight: "auto",
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = data.color ? chroma(data.color) : colorMultiSelect;
    return {
      ...styles,
      backgroundColor: isDisabled ? null : isSelected ? data.color : isFocused ? color.alpha(0.1).css() : null,
      color: isDisabled ? "#ccc" : isSelected ? (chroma.contrast(color, "white") > 2 ? "white" : "black") : data.color,
      cursor: isDisabled ? "not-allowed" : "default",

      ":active": {
        ...styles[":active"],
        backgroundColor: !isDisabled && (isSelected ? data.color : "white"),
      },
    };
  },
  multiValue: (styles, { data }) => {
    const color = data.color ? chroma(data.color) : colorMultiSelect;
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    };
  },
  multiValueLabel: (styles, { data, isDisabled }) => ({
    ...styles,
    color: data.color ? data.color : colorMultiSelect,
    paddingRight: isDisabled ? "6px" : styles["paddingRight"],
    ":hover": {
      cursor: "pointer",
      backgroundColor: data.color ? data.color : colorMultiSelect,
      color: "white",
    },
  }),
  multiValueRemove: (styles, { data, isDisabled }) => ({
    ...styles,
    display: isDisabled ? "none" : styles["display"],
    color: data.color,
    ":hover": {
      backgroundColor: data.color ? data.color : colorMultiSelect,
      color: "white",
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: 0,
    "margin-left": "-2px",
  }),
  indicatorSeparator: (styles) => ({ display: "none" }),
};

export function MultiSelectOrganization(props) {
  const selectRef = React.createRef();

  const handleMultiValueClick = (e, innerProps) => {
    props.onSelectElement && props.onSelectElement({ name: innerProps.data.label, ...innerProps.data.value });
    selectRef.current.select.blur();
  };

  const MultiValueLabel = (props) => {
    return (
      <div onClick={(e) => handleMultiValueClick(e, props)}>
        <components.MultiValueLabel {...props} />
      </div>
    );
  };

  return (
    <Select
      closeMenuOnSelect={true}
      components={{ MultiValueLabel, DropdownIndicator }}
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
