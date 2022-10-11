import "./styles.scss";

import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { IdType } from "utility/prop-types";

export const DFormFieldLabel = ({ id, label, small = false, className }) => {
  const classes = classnames("dform-field-label", { "dform-field-label--small": small }, className);

  if (id === undefined) {
    return (
      <span className={classes}>
        <span>{label}</span>
      </span>
    );
  }

  return (
    <label className={classes} htmlFor={id}>
      <span>{label}</span>
    </label>
  );
};

DFormFieldLabel.propTypes = {
  id: IdType,
  label: PropTypes.string.isRequired,
};
