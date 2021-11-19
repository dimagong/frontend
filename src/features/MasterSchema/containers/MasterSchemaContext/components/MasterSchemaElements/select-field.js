import Select from 'react-select';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';

import BaseFormField from './base-form-field';

const SelectField = ({
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
}) => {
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
    <BaseFormField label={label} dirty={dirty} invalid={invalid} errors={errors}>
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
    </BaseFormField>
  );
};

SelectField.defaultProps = {
  errors: [],
};

SelectField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,

  valid: PropTypes.bool,
  invalid: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.string),

  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default SelectField;
