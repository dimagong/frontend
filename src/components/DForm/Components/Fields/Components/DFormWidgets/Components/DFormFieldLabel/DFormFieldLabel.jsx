import "./styles.scss";

import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { IdType } from "utility/prop-types";

export const DFormFieldLabel = ({ id, label, isError = false, isRequired = false, className }) => {
  if (id === undefined) {
    return (
      <div className={classnames("dform-field-label", { "dform-field-label--is-error": isError }, className)}>
        <span>{label}</span>
        {isRequired ? <span className="dform-field-label__asterix">*</span> : null}
      </div>
    );
  }

  return (
    <label className={classnames("dform-field-label", { "dform-field-label--is-error": isError })} htmlFor={id}>
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
