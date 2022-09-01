import "./styles.scss";

import React from "react";
import PropTypes from "prop-types";

import { IdType } from "utility/prop-types";

import textValidationSchema from "./validationSchema";

import { DFormFieldContainer } from "../DFormFieldContainer";

const defaultPlaceholder = "Enter your answer here";

export const DFormTextWidget = (props) => {
  const {
    id,
    value = "",
    label,
    error,
    isError,
    isRequired,
    isDisabled,
    isLabelShowing,
    placeholder = defaultPlaceholder,
    onChange: propOnChange,
    className,
  } = props;

  const onChange = (event) => propOnChange(event.target.value);

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
      <input
        id={id}
        type="text"
        value={value}
        disabled={isDisabled}
        placeholder={placeholder}
        onChange={onChange}
        className="dform-text-field"
      />
    </DFormFieldContainer>
  );
};

DFormTextWidget.propTypes = {
  id: IdType.isRequired,
  value: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  isError: PropTypes.bool.isRequired,
  isRequired: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  isLabelShowing: PropTypes.bool.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};

DFormTextWidget.validationSchema = textValidationSchema;
