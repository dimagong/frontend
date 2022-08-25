import { Input } from "reactstrap";
import PropTypes from "prop-types";
import React, { useMemo, useState, forwardRef } from "react";

import DeprecatedFormField from "./DeprecatedFormField";

const inputStyles = {
  borderRadius: "0",
  borderTop: "none",
  borderLeft: "none",
  borderRight: "none",
};

const TextField = forwardRef((props, ref) => {
  const { label, type, name, value, errors, valid, invalid, placeholder, onChange, children, style, ...attrs } = props;

  const [dirty, setDirty] = useState(false);
  const onInput = useMemo(() => (dirty ? null : () => setDirty(true)), [dirty]);

  const renderInput = (id) => {
    return (
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
        style={style}
        innerRef={ref}
        {...attrs}
      />
    );
  };

  const renderChildren = () => {
    switch (typeof children) {
      case "function":
        return ({ id, error, label }) => children({ input: renderInput(id), error, label });
      default:
        return ({ id, error, label }) => (
          <>
            {label}
            {renderInput(id)}
            {error}
          </>
        );
    }
  };

  return (
    <DeprecatedFormField dirty={dirty} invalid={invalid} errors={errors} label={label}>
      {renderChildren()}
    </DeprecatedFormField>
  );
});

TextField.defaultProps = {
  type: "text",
  errors: [],
  style: inputStyles,
};

TextField.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.any,

  valid: PropTypes.bool,
  invalid: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.string),

  onChange: PropTypes.func.isRequired,

  placeholder: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  style: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

export default TextField;
