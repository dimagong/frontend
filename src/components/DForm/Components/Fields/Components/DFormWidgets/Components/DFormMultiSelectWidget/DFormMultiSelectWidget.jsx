import React from "react";
import PropTypes from "prop-types";

import DeprecatedNmpSelect from "components/nmp/DeprecatedNmpSelect";

import { IdType, OptionsType } from "utility/prop-types";

import multiSelectValidationSchema from "./validationSchema";

import { DFormFieldContainer } from "../DFormFieldContainer";
import { DFormBooleanWidget } from "../DFormBooleanWidget";

const MultiSelectCheckbox = ({ option, value, isDisabled, onChange: propOnChange }) => {
  const onChange = (value) => propOnChange({ option, value });

  return (
    <DFormBooleanWidget
      id={option.value}
      value={value}
      label={option.value}
      isError={false}
      isRequired={false}
      isDisabled={isDisabled}
      isLabelShowing={true}
      onChange={onChange}
      className="py-1"
    />
  );
};

const MultiSelectCheckboxes = ({ options, value, isDisabled, onChange: propOnChange }) => {
  const onChange = (checkboxValue) => {
    propOnChange(
      checkboxValue.value
        ? [...value, checkboxValue.option]
        : value.filter(({ value }) => value !== checkboxValue.option.value)
    );
  };

  return (
    <>
      {options.map((option, index) => (
        <MultiSelectCheckbox
          option={option}
          value={value.some(({ value }) => option.value === value)}
          isDisabled={isDisabled}
          onChange={onChange}
          key={`${option.value}-${index}`}
        />
      ))}
    </>
  );
};

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

const defaultPlaceholder = "Select an option";

export const DFormMultiSelectWidget = (props) => {
  const {
    id,
    value = [],
    label,
    error,
    options,
    uiStyle,
    isError,
    isRequired,
    isDisabled,
    isLabelShowing,
    placeholder = defaultPlaceholder,
    onChange,
    className,
  } = props;

  if (uiStyle === "checkboxes") {
    return (
      <DFormFieldContainer
        id={id}
        error={error}
        label={label}
        isError={isError}
        isRequired={isRequired}
        isLabelShowing={isLabelShowing}
        className={className}
      >
        <MultiSelectCheckboxes options={options} value={value} isDisabled={isDisabled} onChange={onChange} />
      </DFormFieldContainer>
    );
  }

  return (
    <DFormFieldContainer
      id={id}
      error={error}
      label={label}
      isError={isError}
      isRequired={isRequired}
      isLabelShowing={isLabelShowing}
      className={className}
    >
      <DeprecatedNmpSelect
        inputId={id}
        value={value}
        options={options}
        maxMenuHeight="175"
        styles={colourStyles}
        placeholder={placeholder}
        multiple
        isDisabled={isDisabled}
        onChange={onChange}
      />
    </DFormFieldContainer>
  );
};

DFormMultiSelectWidget.validationSchema = multiSelectValidationSchema;

DFormMultiSelectWidget.propTypes = {
  id: IdType.isRequired,
  value: OptionsType,
  label: PropTypes.string,
  error: PropTypes.string,
  options: OptionsType.isRequired,
  uiStyle: PropTypes.string,
  placeholder: PropTypes.string,
  isError: PropTypes.bool.isRequired,
  isRequired: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  isLabelShowing: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
};
