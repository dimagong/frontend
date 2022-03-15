import React from "react";
import Select from "react-select";
import PropTypes from "prop-types";

import { useForkRef } from "hooks/useForkRef";
import { stopAndPrevent } from "utility/event-decorators";

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

const getMultiValueContainer = (selectRef) => {
  const MultiValueContainer = ({ data, children }) => {
    const clickHandler = React.useCallback(() => selectRef.current.select.removeValue(data), [data]);

    return (
      <div onClick={clickHandler} onMouseDown={stopAndPrevent()}>
        {data.label}
      </div>
    );
  };

  return MultiValueContainer;
};

const defaultComponents = {
  IndicatorSeparator: null,
  MultiValueLabel: () => null,
  MultiValueRemove: () => null,
};

const NmpSelect = React.forwardRef((props, ref) => {
  const {
    value,
    options,
    onChange,
    valid,
    disabled,
    placeholder,
    searchable = false,
    multiple = false,
    children,
    ...attrs
  } = props;

  const innerRef = React.useRef(null);
  const forkedRef = useForkRef(ref, innerRef);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const MultiValueContainer = React.useMemo(() => getMultiValueContainer(forkedRef), []);
  const components = React.useMemo(() => ({ ...defaultComponents, MultiValueContainer }), [MultiValueContainer]);

  return (
    <Select
      value={value}
      options={options}
      onChange={onChange}
      valid={valid}
      placeholder={placeholder}
      isMulti={multiple}
      isSearchable={searchable}
      isDisabled={disabled}
      components={components}
      getOptionValue={(option) => option.value.name}
      styles={selectStyles}
      ref={forkedRef}
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

  multiple: PropTypes.bool,
  searchable: PropTypes.bool,
  getOptionValue: PropTypes.func,
};

export default NmpSelect;
