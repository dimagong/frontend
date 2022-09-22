import React from "react";

import DeprecatedNmpSelect from "components/nmp/DeprecatedNmpSelect";

const defaultStyles = {
  control: (styles) => ({
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

  indicatorSeparator: () => ({ display: "none" }),
};

const versionSelectStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    border: 0,
    borderRadius: "8px",
    // This line disable the blue border
    boxShadow: "0px 2px 4px 0px rgba(34, 60, 80, 0.2)",
    minHeight: "auto",
    cursor: "pointer",
    padding: "0 15px 0 7px",
    fontSize: "11px",
    fontFamily: "Montserrat",
  }),
  placeholder: (styles) => ({
    ...styles,
    color: "#4B484D",
  }),
  input: (styles) => ({
    ...styles,

    padding: "6px 7px 6px 0",
  }),

  indicatorSeparator: () => ({ display: "none" }),
};

const SurveySelectComponent = ({
  value,
  onChange,
  options,
  displayType,
  label,
  name,
  className,
  onInputChange,
  ...rest
}) => {
  return (
    <div className={className || ""}>
      {!!label && (
        <label className="survey-input-component_label" htmlFor={name}>
          {label}
        </label>
      )}
      <DeprecatedNmpSelect
        value={value}
        maxMenuHeight={200}
        multiple={false}
        clearable={false}
        styles={displayType === "versionSelect" ? versionSelectStyles : defaultStyles}
        options={options}
        onChange={onChange}
        onInputChange={onInputChange}
        classNamePrefix="select"
        id="organizations"
        {...rest}
      />
    </div>
  );
};

SurveySelectComponent.defaultProps = {
  isCreatable: false,
};

export default SurveySelectComponent;
