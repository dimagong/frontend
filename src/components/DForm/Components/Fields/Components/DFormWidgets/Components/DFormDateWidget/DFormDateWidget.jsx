import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { IdType } from "utility/prop-types";

import { NpmDatePicker, NpmTimePicker } from "features/nmp-ui";
import { DateWidgetFormatTypes } from "features/Applications/constants";

import dateValidationSchema from "./validationSchema";

import { DFormFieldContainer } from "../DFormFieldContainer";

const getPicker = (dateType) => {
  switch (dateType) {
    case DateWidgetFormatTypes.Time:
      return NpmTimePicker;
    case DateWidgetFormatTypes.Date:
      return NpmDatePicker;
    default:
      throw new Error(`Unsupported date type: '${dateType}'`);
  }
};

export const DFormDateWidget = (props) => {
  const { id, value, label, format, isRequired, isDisabled, isLabelShowing, onChange, className } = props;

  const Picker = getPicker(format);

  return (
    <DFormFieldContainer
      name={label}
      label={label}
      isRequired={isRequired}
      isLabelShowing={isLabelShowing}
      className={classnames(className)}
    >
      <Picker id={id} value={value} disabled={isDisabled} onChange={onChange} />
    </DFormFieldContainer>
  );
};

DFormDateWidget.propTypes = {
  id: IdType.isRequired,
  value: PropTypes.string,
  format: PropTypes.oneOf(["date", "date-time"]),
  label: PropTypes.string,
  isRequired: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  isLabelShowing: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
};

DFormDateWidget.validationSchema = dateValidationSchema;
