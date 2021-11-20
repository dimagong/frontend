import Select from 'react-select';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';

import MSEFormField from './mse-form-field';

const SelectField = (props) => {
  const {
    label,
    name,
    value,
    options,
    errors,
    valid,
    invalid,
    placeholder,
    onChange: propOnChange,
    children,
    ...attrs
  } = props;

  const [dirty, setDirty] = useState(false);
  const onChange = useMemo(
    () =>
      dirty
        ? propOnChange
        : (event) => {
            setDirty(true);
            propOnChange(event);
          },
    [dirty, propOnChange]
  );

  return (
    <MSEFormField label={label} dirty={dirty} invalid={invalid} errors={errors}>
      <Select
        name={name}
        defaultValue={value}
        options={options}
        onChange={onChange}
        placeholder={placeholder}
        {...attrs}
      >
        {children}
      </Select>
    </MSEFormField>
  );
};

SelectField.defaultProps = {
  errors: [],
};

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,

  valid: PropTypes.bool,
  invalid: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.string),

  placeholder: PropTypes.string,
  label: PropTypes.string.isRequired,

  onChange: PropTypes.func.isRequired,

  children: PropTypes.node,
};

export default SelectField;
