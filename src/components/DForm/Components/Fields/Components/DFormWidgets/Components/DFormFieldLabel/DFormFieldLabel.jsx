import "./styles.scss";

import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { IdType } from "utility/prop-types";

export const DFormFieldLabel = ({ id, label, isError = false, isRequired = false, small = false, className }) => {
  const classes = classnames(
    "dform-field-label",
    {
      "dform-field-label--small": small,
      "dform-field-label--is-error": isError,
    },
    className
  );

  if (id === undefined) {
    return (
      <span className={classes}>
        <span>{label}</span>
        {isRequired ? <span className="dform-field-label__asterix">*</span> : null}
      </span>
    );
  }

  return (
    <label className={classes} htmlFor={id}>
      <span>{label}</span>
      {isRequired ? <span className="dform-field-label__asterix">*</span> : null}
    </label>
  );
};

DFormFieldLabel.propTypes = {
  id: IdType,
  label: PropTypes.string.isRequired,
  isError: PropTypes.bool,
  isRequired: PropTypes.bool,
};
