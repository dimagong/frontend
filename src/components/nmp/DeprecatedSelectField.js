import PropTypes from "prop-types";
import React, { useMemo, useState } from "react";

import DeprecatedNmpSelect from "./DeprecatedNmpSelect";
import DeprecatedFormField from "./DeprecatedFormField";

const DeprecatedSelectField = (props) => {
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
      <DeprecatedNmpSelect
        inputId={id}
        value={value}
        options={options}
        onChange={onChange}
        placeholder={placeholder}
        {...attrs}
      >
        {innerChildren}
      </DeprecatedNmpSelect>
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
    <DeprecatedFormField label={label} dirty={dirty} invalid={invalid} errors={errors}>
      {renderChildren()}
    </DeprecatedFormField>
  );
};

DeprecatedSelectField.propTypes = {
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

export default DeprecatedSelectField;
