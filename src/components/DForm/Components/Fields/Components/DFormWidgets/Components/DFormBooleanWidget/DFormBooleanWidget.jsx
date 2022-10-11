import React from "react";
import PropTypes from "prop-types";

import { IdType } from "utility/prop-types";
import { NpmCheckbox } from "features/nmp-ui";

import booleanValidationSchema from "./validationSchema";

import { DFormFieldContainer } from "../DFormFieldContainer";
import { DFormFieldLabel } from "../DFormFieldLabel";

export const DFormBooleanWidget = (props) => {
  const {
    id,
    value = false,
    label,
    error,
    isError,
    isRequired,
    isDisabled,
    isLabelShowing,
    onChange: propOnChange,
    className,
  } = props;

  const onChange = (event) => propOnChange(event.target.checked);

  return (
    <DFormFieldContainer
      id={id}
      error={error}
      label={label}
      isError={isError}
      isRequired={isRequired}
      isLabelShowing={false}
      className={className}
    >
      <NpmCheckbox
        id={id}
        checked={value}
        disabled={isDisabled}
        label={isLabelShowing ? <DFormFieldLabel label={label} small /> : null}
        onChange={onChange}
      />
    </DFormFieldContainer>
  );
};

DFormBooleanWidget.propTypes = {
  id: IdType.isRequired,
  value: PropTypes.bool,
  label: PropTypes.string,
  error: PropTypes.string,
  isError: PropTypes.bool.isRequired,
  isRequired: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  isLabelShowing: PropTypes.bool.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};

DFormBooleanWidget.validationSchema = booleanValidationSchema;
