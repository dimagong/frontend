import React from "react";
import PropTypes from "prop-types";

import { NmpSelect } from "features/nmp-ui";
import { IdType, OptionsType } from "utility/prop-types";

import { DFormFieldContainer } from "../DFormFieldContainer";
import { DFormBooleanWidget } from "../DFormBooleanWidget";

import multiSelectValidationSchema from "./validationSchema";

const MultiSelectCheckbox = ({ option, value, isDisabled, onChange: propOnChange }) => {
  const onChange = (value) => propOnChange({ option, value });

  return (
    <DFormBooleanWidget
      id={option.value}
      value={value}
      label={option.value}
      isError={false}
      isRequired={false}
      isDisabled={isDisabled}
      isLabelShowing={true}
      onChange={onChange}
      className="py-1"
    />
  );
};

const MultiSelectCheckboxes = ({ options, value, isDisabled, onChange: propOnChange }) => {
  const onChange = (checkboxValue) => {
    propOnChange(
      checkboxValue.value
        ? [...value, checkboxValue.option]
        : value.filter(({ value }) => value !== checkboxValue.option.value)
    );
  };

  return (
    <>
      {options.map((option, index) => (
        <MultiSelectCheckbox
          option={option}
          value={value.some(({ value }) => option.value === value)}
          isDisabled={isDisabled}
          onChange={onChange}
          key={`${option.value}-${index}`}
        />
      ))}
    </>
  );
};

const defaultPlaceholder = "Select an option";

export const DFormMultiSelectWidget = (props) => {
  const {
    id,
    value = [],
    label,
    error,
    options,
    uiStyle,
    isError,
    isRequired,
    isDisabled,
    isLabelShowing,
    placeholder = defaultPlaceholder,
    onChange,
    className,
  } = props;

  if (uiStyle === "checkboxes") {
    return (
      <DFormFieldContainer
        id={id}
        error={error}
        label={label}
        isError={isError}
        isRequired={isRequired}
        isLabelShowing={isLabelShowing}
        className={className}
      >
        <MultiSelectCheckboxes options={options} value={value} isDisabled={isDisabled} onChange={onChange} />
      </DFormFieldContainer>
    );
  }

  return (
    <DFormFieldContainer
      id={id}
      error={error}
      label={label}
      isError={isError}
      isRequired={isRequired}
      isLabelShowing={isLabelShowing}
      className={className}
    >
      <NmpSelect
        id={id}
        mode="multiple"
        value={value.map(({ value }) => value)}
        options={options}
        disabled={isDisabled}
        allowClear
        placeholder={placeholder}
        onChange={(_, options) => onChange(options)}
      />
    </DFormFieldContainer>
  );
};

DFormMultiSelectWidget.validationSchema = multiSelectValidationSchema;

DFormMultiSelectWidget.propTypes = {
  id: IdType.isRequired,
  value: OptionsType,
  label: PropTypes.string,
  error: PropTypes.string,
  options: OptionsType.isRequired,
  uiStyle: PropTypes.string,
  placeholder: PropTypes.string,
  isError: PropTypes.bool.isRequired,
  isRequired: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  isLabelShowing: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
};
