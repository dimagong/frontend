import Select from "react-select";
import PropTypes from "prop-types";
import React, { useMemo, useState } from "react";

import FormField from "./FormField";

const SelectField = (props) => {
  const {
    label,
    value,
    options,
    errors = [],
    valid,
    invalid,
    placeholder,
    onChange: propOnChange,
    innerChildren,
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

  const renderSelect = (id) => {
    return (
      <Select inputId={id} value={value} options={options} onChange={onChange} placeholder={placeholder} {...attrs}>
        {innerChildren}
      </Select>
    );
  };

  const renderChildren = () => {
    switch (typeof children) {
      case "function":
        return ({ id, error, label }) => children({ select: renderSelect(id), error, label });
      default:
        return ({ id, error, label }) => (
          <>
            {label}
            {renderSelect(id)}
            {error}
          </>
        );
    }
  };

  return (
    <FormField label={label} dirty={dirty} invalid={invalid} errors={errors}>
      {renderChildren()}
    </FormField>
  );
};

SelectField.propTypes = {
  value: PropTypes.shape({ label: PropTypes.string, value: PropTypes.any }),
  options: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, value: PropTypes.any })).isRequired,

  valid: PropTypes.bool,
  invalid: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.string),

  placeholder: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

  onChange: PropTypes.func.isRequired,

  innerChildren: PropTypes.node,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

export default SelectField;
