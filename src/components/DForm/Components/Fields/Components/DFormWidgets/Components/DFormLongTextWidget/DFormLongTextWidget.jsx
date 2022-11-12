import "./styles.scss";

import PropTypes from "prop-types";
import React, { useEffect, useReducer, useState } from "react";

import { IdType } from "utility/prop-types";
import { DFormLongText } from "features/dform/ui/DFormLongText";

import { DFormFieldContainer } from "../DFormFieldContainer";
import longTextValidationSchema from "./validationSchema";

export const DFormLongTextWidget = (props) => {
  const { id, value = "", label, error, isError, isRequired, isDisabled, isLabelShowing, onChange, className } = props;

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
      <DFormLongText id={id} value={value} isDisabled={isDisabled} onChange={onChange} />
    </DFormFieldContainer>
  );
};

DFormLongTextWidget.propTypes = {
  id: IdType.isRequired,
  value: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  isError: PropTypes.bool.isRequired,
  isRequired: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  isLabelShowing: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
};

DFormLongTextWidget.validationSchema = longTextValidationSchema;
