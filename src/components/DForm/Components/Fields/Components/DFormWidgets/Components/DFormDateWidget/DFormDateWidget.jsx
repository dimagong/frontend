import "./styles.scss";

import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { IdType } from "utility/prop-types";

import { DateWidgetFormatTypes } from "features/Applications/constants";

import dateValidationSchema from "./validationSchema";

import { DFormFieldContainer } from "../DFormFieldContainer";

import { NpmDatePicker, NpmTimePicker } from "../../../../../../../../features/nmp-ui";

const getInputTypeByFormat = (format) => {
  switch (format) {
    case DateWidgetFormatTypes.Time:
      return "datetime-local";
    case DateWidgetFormatTypes.Date:
    default:
      return "date";
  }
};

const convertToInputDate = (value, format) => {
  if (typeof value !== "string") {
    throw new Error(`Unexpected value type: ${typeof value}`);
  }

  if (value.length > 0) {
    switch (format) {
      case DateWidgetFormatTypes.Date:
        return value.substring(0, value.indexOf("T"));
      case DateWidgetFormatTypes.Time:
        return value.substring(0, value.indexOf("T") + 6);
      default:
        return "";
    }
  }
};

export const DFormDateWidget = (props) => {
  const {
    id,
    value: propValue,
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

  // const onChange = (event) => propOnChange(new Date(event.target.value).toISOString());
  const onChange = (data, datastring) => {
    propOnChange(new Date(datastring).toISOString());
  };

  const value = convertToInputDate(propValue, format);

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
      {format === DateWidgetFormatTypes.Time && <NpmTimePicker onChangeTime={onChange} />}
      {format === DateWidgetFormatTypes.Date && <NpmDatePicker onChangeDate={onChange} />}

      {/* <input id={id} value={value} type={type} onChange={onChange} disabled={isDisabled} className="dform-date-field" /> */}
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
