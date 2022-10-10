import React from "react";
import PropTypes from "prop-types";

import { IdType } from "utility/prop-types";
import { NmpTextArea } from "features/nmp-ui";

import { DFormFieldContainer } from "../DFormFieldContainer";

import textareaValidationSchema from "./validationSchema";

const defaultPlaceholder = "Enter your answer here";

export const DFormTextAreaWidget = (props) => {
  const {
    id,
    value = "",
    label,
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
      name={label}
      label={label}
      isRequired={isRequired}
      isLabelShowing={isLabelShowing}
      className={className}
    >
      <NmpTextArea id={id} rows="5" placeholder={placeholder} value={value} disabled={isDisabled} onChange={onChange} />
    </DFormFieldContainer>
  );
};

DFormTextAreaWidget.propTypes = {
  id: IdType.isRequired,
  value: PropTypes.string,
  label: PropTypes.string,
  isRequired: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  isLabelShowing: PropTypes.bool.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};

DFormTextAreaWidget.validationSchema = textareaValidationSchema;
