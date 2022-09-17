import React from "react";
import PropTypes from "prop-types";
import Creatable from "react-select/creatable";
import Select, { components } from "react-select";

import { useForkRef } from "hooks/useForkRef";

const baseControlStyles = {
  fontSize: "1rem",

  borderRadius: 0,
  borderTop: "none",
  borderLeft: "none",
  borderRight: "none",
  borderColor: "currentColor",

  color: "#707070",

  boxShadow: "none",
  "&:hover": {},
};

const defaultControlStyles = {
  ...baseControlStyles,
  "&:hover": {
    borderColor: "rgba(112,112,112,0.6)",
  },
};

const validControlStyles = {
  ...defaultControlStyles,
  borderColor: "var(--success)",
  "&:hover": {
    borderColor: "var(--success)",
  },
};

const invalidControlStyles = {
  ...defaultControlStyles,
  borderColor: "var(--danger)",
  "&:hover": {
    borderColor: "var(--danger)",
  },
};

const selectStyles = {
  multiValue: () => ({
    margin: ".5rem .5rem .5rem 0",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    padding: 0,
    paddingLeft: 0,
    fontSize: "inherit",
    color: "currentColor",
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: "inherit",
    color: "currentColor",
  }),
  dropdownIndicator: (provided, state) => {
    if (state.selectProps.readonly) {
      return {
        ...provided,
        ":hover": {},
        color: "hsl(0,0%,80%)",
      };
    }
    return provided;
  },
  control: (provided, state) => {
    provided = {
      ...provided,
      backgroundColor: state.selectProps.backgroundColor,
    };

    if (state.selectProps.isDisabled) {
      return {
        ...provided,
        ...defaultControlStyles,
      };
    }

    if (state.selectProps.readonly) {
      return {
        ...provided,
        ...baseControlStyles,
      };
    }

    if (state.selectProps.invalid) {
      return {
        ...provided,
        ...invalidControlStyles,
      };
    }

    if (state.selectProps.valid) {
      return {
        ...provided,
        ...validControlStyles,
      };
    }

    return {
      ...provided,
      ...baseControlStyles,
    };
  },
  placeholder: (provided) => ({
    ...provided,
    width: "100%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }),
};

const MultiValue = ({ index, data, getValue, selectProps, ...restProps }) => {
  const valueSeparator = selectProps.valueSeparator;
  const getValueLabel = (option) => selectProps.formatOptionLabel?.(option, "value") || option.label;
  const label = index > 0 ? `${valueSeparator}${getValueLabel(data)}` : `${getValueLabel(data)}`;

  return (
    <components.MultiValue
      getValue={getValue}
      {...restProps}
      index={index}
      data={data}
      selectProps={selectProps}
      components={{
        Container: selectProps.components.MultiValueContainer || components.MultiValueContainer,
        Label: selectProps.components.MultiValueLabel || components.MultiValueLabel,
        Remove: selectProps.components.MultiValueRemove || components.MultiValueRemove,
      }}
    >
      {label}
    </components.MultiValue>
  );
};

const MultiValueContainer = ({ innerProps, children }) => {
  return <div {...innerProps}>{children}</div>;
};

const defaultComponents = {
  IndicatorSeparator: null,
  MultiValue,
  MultiValueContainer,
  MultiValueRemove: () => null,
};

const NmpSelect = React.forwardRef((props, ref) => {
  const {
    value,
    options,
    onChange,
    onInputChange,

    valid = false,
    invalid = false,
    disabled = false,
    readonly = false,

    placeholder,
    valueSeparator = ",",

    loading = false,
    clearable = false,
    multiple = false,
    searchable,
    getOptionValue,
    isCreatable = false,

    menuIsOpen,

    backgroundColor = "hsl(0,0%,100%)",

    styles = {},

    children,
    ...attrs
  } = props;

  const innerRef = React.useRef(null);
  const forkedRef = useForkRef(innerRef, ref);

  const SelectComponent = isCreatable ? Creatable : Select;

  return (
    <SelectComponent
      value={value}
      options={options}
      onChange={onChange}
      onInputChange={onInputChange}
      valid={valid}
      invalid={invalid}
      placeholder={placeholder}
      valueSeparator={valueSeparator}
      isDisabled={disabled}
      isLoading={loading}
      isClearable={readonly ? false : clearable}
      isMulti={multiple}
      isSearchable={readonly ? false : searchable}
      menuIsOpen={readonly ? false : menuIsOpen}
      components={defaultComponents}
      getOptionValue={getOptionValue}
      styles={{ ...selectStyles, ...styles }}
      ref={forkedRef}
      readonly={readonly}
      backgroundColor={backgroundColor}
      {...attrs}
    >
      {children}
    </SelectComponent>
  );
});

NmpSelect.displayName = "NmpSelect";

const optionType = PropTypes.shape({ label: PropTypes.string.isRequired, value: PropTypes.any.isRequired });

NmpSelect.propTypes = {
  value: PropTypes.oneOfType([optionType, PropTypes.arrayOf(optionType)]),
  options: PropTypes.arrayOf(optionType),
  onChange: PropTypes.func,
  inputValue: PropTypes.string,
  onInputChange: PropTypes.func,

  valid: PropTypes.bool,
  invalid: PropTypes.bool,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,

  placeholder: PropTypes.string,
  valueSeparator: PropTypes.string,

  loading: PropTypes.bool,
  clearable: PropTypes.bool,
  multiple: PropTypes.bool,
  searchable: PropTypes.bool,
  getOptionValue: PropTypes.func,

  isCreatable: PropTypes.bool,

  menuIsOpen: PropTypes.bool,

  styles: PropTypes.object,

  backgroundColor: PropTypes.string,
};

export default NmpSelect;
