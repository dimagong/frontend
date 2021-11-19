import React from 'react';
import { Label } from 'reactstrap';
import { isFunction } from 'lodash/fp';
import PropTypes from 'prop-types';

let formFieldCounter = 0;

const BaseFormField = ({ label, dirty, invalid, errors, children }) => {
  const id = `form-field-${formFieldCounter++}`;

  return (
    <>
      {label && <Label for={id}>{label}</Label>}
      {isFunction(children) ? children(id) : children}
      {dirty && invalid && <div className="input-field__error">{errors[0]}</div>}
    </>
  );
};

BaseFormField.defaultProps = {
  errors: [],
};

BaseFormField.propTypes = {
  label: PropTypes.string,
  dirty: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  errors: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
};

export default BaseFormField;
