import React from "react";
import Select from "react-select";
import PropTypes from "prop-types";

const baseControlStyles = {
  borderRadius: 0,
  borderTop: "none",
  borderLeft: "none",
  borderRight: "none",
  boxShadow: "none",
};

const validControlStyles = {
  ...baseControlStyles,
  borderColor: "var(--success)",
};

const invalidControlStyles = {
  ...baseControlStyles,
  borderColor: "var(--danger)",
};

const selectStyles = {
  control: (provided, state) => {
    if (state.selectProps.valid === true) {
      return {
        ...provided,
        ...validControlStyles,
      };
    }

    if (state.selectProps.valid === false) {
      return {
        ...provided,
        ...invalidControlStyles,
      };
    }

    return {
      ...provided,
      ...baseControlStyles,
    };
  },
};

const defaultComponents = { IndicatorSeparator: null };

const NmpSelect = React.forwardRef((props, ref) => {
  const { value, options, onChange, valid, disabled, placeholder, children, ...attrs } = props;

  return (
    <Select
      value={value}
      options={options}
      onChange={onChange}
      isSearchable={false}
      isDisabled={disabled}
      placeholder={placeholder}
      valid={valid}
      components={defaultComponents}
      styles={selectStyles}
      ref={ref}
      {...attrs}
    >
      {children}
    </Select>
  );
});

NmpSelect.displayName = "NmpSelect";

const optionType = PropTypes.shape({ label: PropTypes.string.isRequired, value: PropTypes.any.isRequired });

NmpSelect.propTypes = {
  value: PropTypes.oneOfType([optionType, PropTypes.arrayOf(optionType)]),
  options: PropTypes.arrayOf(optionType),
  onChange: PropTypes.func,

  valid: PropTypes.bool,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,

  // Take rest props from 'react-select'
};

export default NmpSelect;
