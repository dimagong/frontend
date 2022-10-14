import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { IdType } from "utility/prop-types";

import { DFormFieldLabel } from "../DFormFieldLabel";

export const DFormFieldContainer = ({ id, label, error, isError, isRequired, isLabelShowing, className, children }) => {
  return (
    <div className={classnames("d-flex flex-column justify-content-between w-100", className)}>
      {isLabelShowing ? <DFormFieldLabel id={id} label={label} isError={isError} isRequired={isRequired} /> : null}

      {children}

      {isError ? <span className="font-size-small text-danger">{error}</span> : null}
    </div>
  );
};

DFormFieldContainer.propTypes = {
  id: IdType.isRequired,
  label: PropTypes.string,
  error: PropTypes.string,
  isError: PropTypes.bool.isRequired,
  isRequired: PropTypes.bool.isRequired,
  isLabelShowing: PropTypes.bool.isRequired,
};
