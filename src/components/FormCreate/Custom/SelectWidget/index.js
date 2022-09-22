import "./styles.scss";

import React from "react";

import DeprecatedNmpSelect from "components/nmp/DeprecatedNmpSelect";

import FieldLabel from "../FieldLabel";

const colourStyles = {
  option: (styles, { isFocused, isSelected, ...rest }) => {
    return {
      ...styles,
      backgroundColor: isSelected ? "#7367f0" : isFocused ? "rgba(0, 0, 0, 0.05)" : null,
      cursor: "pointer",

      ":active": {
        ...styles[":active"],
        backgroundColor: "#7367f0",
        color: "white",
      },
    };
  },
  control: (styles, { selectProps }) => ({
    ...styles,
    backgroundColor: "#eee",
    border: "0 !important",
    borderBottom: "1px solid #707070!important",
    // This line disable the blue border
    boxShadow: "0 !important",
    borderRadius: 0,
    "&:hover": {
      border: "0 !important",
      borderBottom: "1px solid #707070!important",
    },
    cursor: "pointer",
    padding: selectProps.isMulti ? "0 0 8px 4px" : "0 0 0 1px",
  }),
  singleValue: (styles) => ({
    ...styles,
    color: "#707070",
  }),
  multiValueLabel: (styles) => ({
    ...styles,
    color: "#707070",
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    "&:hover": {
      background: "transparent",
      color: "inherit",
    },
  }),
};

const SelectWidget = (props) => {
  const handleChange = (values) => {
    if (props.multiple) {
      const mappedSelectValuesToArray = values
        ? values.map((nextSelectValue) => {
            return nextSelectValue.value;
          })
        : [];
      props.onChange(mappedSelectValuesToArray);
    } else {
      props.onChange(values.value || "");
    }
  };

  const getValue = () => {
    if (props.multiple) {
      return Array.isArray(props.value)
        ? props.options.enumOptions.filter((nextValue) => {
            return props.value.indexOf(nextValue.value) !== -1;
          })
        : [];
    }
    return props.value ? { value: props.value, label: props.value } : null;
  };

  return (
    <div className={"custom-react-select"}>
      <FieldLabel label={props.schema.title} required={props.required} />
      <DeprecatedNmpSelect
        maxMenuHeight={175}
        disabled={props.disabled}
        styles={colourStyles}
        multiple={props.multiple}
        name="colors"
        value={getValue()}
        onChange={handleChange}
        options={props.options.enumOptions}
        className="React"
        classNamePrefix="select"
        placeholder={"Select an option"}
      />
    </div>
  );
};

export default SelectWidget;
