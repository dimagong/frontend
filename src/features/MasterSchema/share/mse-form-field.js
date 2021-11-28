import React from "react";
import PropTypes from "prop-types";
import { Label } from "reactstrap";

const labelStyles = {
  marginBottom: '6px',
  fontWeight: '350',
  fontSize: '0.9375rem',
  lineHeight: '1.25',
  color: '#707070',
};

let formFieldCounter = 0;

const MSEFormField = ({ dirty, invalid, errors, label, error, children }) => {
  const id = `form-field-${formFieldCounter++}`;

  const renderLabel = () => {
    switch (typeof label) {
      case "function":
        return label(id);
      default:
        return <Label for={id} style={labelStyles}>{label}</Label>;
    }
  };

  const renderError = () => {
    if (!dirty || !invalid) return;

    switch (typeof error) {
      case "function":
        return error(errors);
      default:
        return <small className="text-danger">{errors[0]}</small>;
    }
  };

  return children({ id, label: renderLabel(), error: renderError() });
};

MSEFormField.defaultProps = {
  errors: [],
  invalid: false,
};

MSEFormField.propTypes = {
  dirty: PropTypes.bool.isRequired,
  invalid: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.string),

  label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  error: PropTypes.func,
  children: PropTypes.func.isRequired,
};

export default MSEFormField;
