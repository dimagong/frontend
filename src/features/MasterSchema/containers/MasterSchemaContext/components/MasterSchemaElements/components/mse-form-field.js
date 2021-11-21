import React from "react";
import PropTypes from "prop-types";
import { Label } from "reactstrap";

let formFieldCounter = 0;

const MSEFormField = ({ dirty, invalid, errors, label, error, children }) => {
  const id = `form-field-${formFieldCounter++}`;

  const renderLabel = () => {
    switch (typeof label) {
      case 'function': return label(id);
      default: return <Label for={id}>{label}</Label>;
    }
  };

  const renderError = () => {
    if (!dirty || !invalid) return;

    switch (typeof error) {
      case 'function': return error(errors);
      default: return <small className="text-danger">{errors[0]}</small>;
    }
  };

  return children({ id, label: renderLabel(), error: renderError() });
};

MSEFormField.defaultProps = {
  errors: []
};

MSEFormField.propTypes = {
  dirty: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  errors: PropTypes.arrayOf(PropTypes.string),

  label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  error: PropTypes.func,
  children: PropTypes.func.isRequired,
};

export default MSEFormField;
