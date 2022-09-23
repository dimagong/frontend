import React from "react";
import PropTypes from "prop-types";
import { Check } from "react-feather";

import { IdType } from "utility/prop-types";
import { CustomCheckbox } from "components/FormCreate/Custom/CheckboxesWidget/CheckboxesWidget";
import { NpmCheckbox } from "../../../../../../../../features/nmp-ui";

import booleanValidationSchema from "./validationSchema";

import { DFormFieldContainer } from "../DFormFieldContainer";

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
        onChange={onChange}
        checked={value}
        label={isLabelShowing ? label : ""}
        disabled={isDisabled}
      />
      {/* <CustomCheckbox
        id={id}
        color="primary"
        checked={value}
        label={isLabelShowing ? label : ""}
        disabled={isDisabled}
        required={isRequired}
        icon={<Check className="vx-icon" size="16" />}
        onChange={onChange}
      /> */}
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
