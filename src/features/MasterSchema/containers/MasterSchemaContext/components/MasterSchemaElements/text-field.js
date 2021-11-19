import { Input } from 'reactstrap';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';

import BaseFormField from './base-form-field';

const TextField = ({ label, type, name, value, errors, valid, invalid, placeholder, onChange, ...attrs }) => {
  const [dirty, setDirty] = useState(false);
  const onInput = useMemo(() => (dirty ? null : () => setDirty(true)), [dirty]);

  return (
    <BaseFormField label={label} dirty={dirty} invalid={invalid} errors={errors}>
      {(id) => (
        <Input
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          id={id}
          valid={dirty ? valid : null}
          invalid={dirty ? invalid : null}
          onInput={onInput}
          onChange={onChange}
          {...attrs}
        />
      )}
    </BaseFormField>
  );
};

TextField.defaultProps = {
  type: 'text',
  errors: [],
};

TextField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,

  valid: PropTypes.bool,
  invalid: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.string),

  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default TextField;
