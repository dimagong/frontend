import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { IdType } from "utility/prop-types";

import { NpmDatePicker, NpmTimePicker } from "features/nmp-ui";
import { DateWidgetFormatTypes } from "features/Applications/constants";

import dateValidationSchema from "./validationSchema";

import { DFormFieldContainer } from "../DFormFieldContainer";

export const DFormDateWidget = (props) => {
  const { id, value, label, format, error, isError, isRequired, isDisabled, isLabelShowing, onChange, className } =
    props;

  return (
    <DFormFieldContainer
      id={id}
      label={label}
      error={error}
      isError={isError}
      isRequired={isRequired}
      isLabelShowing={isLabelShowing}
      className={classnames(className)}
    >
      {format === DateWidgetFormatTypes.Time ? (
        <NpmTimePicker id={id} value={value} disabled={isDisabled} onChange={onChange} />
      ) : null}

      {format === DateWidgetFormatTypes.Date ? (
        <NpmDatePicker id={id} value={value} disabled={isDisabled} onChange={onChange} />
      ) : null}
    </DFormFieldContainer>
  );
};

DFormDateWidget.propTypes = {
  id: IdType.isRequired,
  value: PropTypes.string,
  format: PropTypes.oneOf(["date", "date-time"]),
  label: PropTypes.string,
  error: PropTypes.string,
  isError: PropTypes.bool.isRequired,
  isRequired: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  isLabelShowing: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
};

DFormDateWidget.validationSchema = dateValidationSchema;
