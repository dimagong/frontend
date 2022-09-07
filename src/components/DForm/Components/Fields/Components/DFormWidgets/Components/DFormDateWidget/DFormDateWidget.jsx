import "./styles.scss";

import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { IdType } from "utility/prop-types";

import { DateWidgetFormatTypes } from "features/Applications/constants";

import dateValidationSchema from "./validationSchema";

import { DFormFieldContainer } from "../DFormFieldContainer";

const getInputTypeByFormat = (format) => {
  switch (format) {
    case DateWidgetFormatTypes.Time:
      return "datetime-local";
    case DateWidgetFormatTypes.Date:
    default:
      return "date";
  }
};

export const DFormDateWidget = (props) => {
  const {
    id,
    value = "",
    label,
    format,
    error,
    isError,
    isRequired,
    isDisabled,
    isLabelShowing,
    onChange: propOnChange,
    className,
  } = props;

  const type = getInputTypeByFormat(format);

  const onChange = (event) => propOnChange(event.target.valueAsDate.toISOString());

  const getValue = () => {
    if (typeof value === "string" && value.length > 0) {
      switch (format) {
        case DateWidgetFormatTypes.Date:
          return value.substring(0, 10);
        case DateWidgetFormatTypes.Time:
          return value.slice(0, -1);
        default:
          return "";
      }
    }
    return value;
  };

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
      <input
        id={id}
        value={getValue()}
        type={type}
        onChange={onChange}
        disabled={isDisabled}
        className="dform-date-field"
      />
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
