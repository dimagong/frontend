import React from "react";
import Select from "react-select";
import "./styles.scss";
import FieldLabel from "../FieldLabel";
import { DFormWidgetEventsTypes } from "../../events";

export const colourStyles = {
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
      props.onEvent({ type: DFormWidgetEventsTypes.Change, value: mappedSelectValuesToArray });
    } else {
      props.onChange({ type: DFormWidgetEventsTypes.Change, value: values.value || "" });
    }
  };

  return (
    <div className={"custom-react-select"}>
      <FieldLabel label={props.label} required={props.isRequired} />
      <Select
        maxMenuHeight={175}
        isDisabled={props.disabled}
        styles={colourStyles}
        isMulti={false}
        name="colors"
        value={props.value}
        onChange={handleChange}
        options={props.options}
        className="React"
        classNamePrefix="select"
        placeholder={"Select an option"}
      />
    </div>
  );
};

export default SelectWidget;
