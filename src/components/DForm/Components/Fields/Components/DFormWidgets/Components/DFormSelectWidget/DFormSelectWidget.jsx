import "./styles.scss";

import React from "react";
import PropTypes from "prop-types";

import NmpSelect from "components/nmp/DeprecatedNmpSelect";

import { IdType, OptionsType, OptionType } from "utility/prop-types";

import { DFormFieldContainer } from "../DFormFieldContainer";

import selectValidationSchema from "./validationSchema";

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

const defaultPlaceholder = "Select an option";

export const DFormSelectWidget = (props) => {
  const {
    id,
    value = "",
    label,
    error,
    options,
    isError,
    isLoading = false,
    isRequired,
    isDisabled,
    isLabelShowing,
    placeholder = defaultPlaceholder,
    onChange,
    className,
  } = props;

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
      <NmpSelect
        inputId={id}
        value={value}
        options={options}
        maxMenuHeight={175}
        styles={colourStyles}
        multiple={false}
        loading={isLoading}
        disabled={isDisabled}
        placeholder={placeholder}
        onChange={onChange}
      />
    </DFormFieldContainer>
  );
};

DFormSelectWidget.propTypes = {
  id: IdType.isRequired,
  value: OptionType,
  label: PropTypes.string,
  error: PropTypes.string,
  options: OptionsType.isRequired,
  placeholder: PropTypes.string,
  isError: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool,
  isRequired: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  isLabelShowing: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
};

DFormSelectWidget.validationSchema = selectValidationSchema;
