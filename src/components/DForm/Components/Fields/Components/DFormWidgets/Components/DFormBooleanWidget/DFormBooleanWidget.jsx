import React from "react";
import PropTypes from "prop-types";

import { IdType } from "utility/prop-types";
import { NmpCheckbox } from "features/nmp-ui";

import booleanValidationSchema from "./validationSchema";

import { DFormFieldLabel } from "../DFormFieldLabel";
import { DFormFieldContainer } from "../DFormFieldContainer";

export const DFormBooleanWidget = (props) => {
  const { id, value = false, label, isRequired, isDisabled, isLabelShowing, onChange: propOnChange, className } = props;

  const onChange = (event) => propOnChange(event.target.checked);

  return (
    <DFormFieldContainer
      name={label}
      label={label}
      isRequired={isRequired}
      isLabelShowing={false}
      className={className}
    >
      <NmpCheckbox id={id} checked={value} disabled={isDisabled} onChange={onChange}>
        {isLabelShowing ? <DFormFieldLabel label={label} small /> : null}
      </NmpCheckbox>
    </DFormFieldContainer>
  );
};

DFormBooleanWidget.propTypes = {
  id: IdType.isRequired,
  value: PropTypes.bool,
  label: PropTypes.string,
  isRequired: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  isLabelShowing: PropTypes.bool.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};

DFormBooleanWidget.validationSchema = booleanValidationSchema;
