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
    switch (typeof error) {
      case 'function': return error(errors);
      default: return errors[0];
    }
  };

  const renderChildren = () => {
    switch (typeof children) {
      case 'function': return children(id);
      default: return children;
    }
  };

  return (
    <>
      {renderLabel()}
      {renderChildren()}
      {dirty && invalid && renderError()}
    </>
  );
};

MSEFormField.defaultProps = {
  errors: []
};

MSEFormField.propTypes = {
  dirty: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  errors: PropTypes.arrayOf(PropTypes.string),

  label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
};

export default MSEFormField;
