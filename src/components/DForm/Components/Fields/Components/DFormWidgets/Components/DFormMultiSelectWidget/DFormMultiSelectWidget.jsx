import React from "react";
import PropTypes from "prop-types";

import { NmpSelect, NpmCheckbox } from "features/nmp-ui";
import { IdType, OptionsType } from "utility/prop-types";

import { DFormFieldLabel } from "../DFormFieldLabel";
import { DFormFieldContainer } from "../DFormFieldContainer";

import multiSelectValidationSchema from "./validationSchema";

const defaultPlaceholder = "Select an option";

export const DFormMultiSelectWidget = (props) => {
  const {
    id,
    value = [],
    label,
    options,
    uiStyle,
    isRequired,
    isDisabled,
    isLabelShowing,
    placeholder = defaultPlaceholder,
    onChange,
    className,
  } = props;

  const onCheckboxChange = (checked, option) => {
    const newValue = checked ? [...value, option] : value.filter(({ value }) => value !== option.value);
    onChange(newValue);
  };

  // ToDo: Refactor NpmCheckbox -> NmpCheckbox
  // ToDo: Create NmpCheckbox.Group
  // ToDo: Use right here the NmpCheckbox.Group
  if (uiStyle === "checkboxes") {
    return (
      <DFormFieldContainer
        id={id}
        label={label}
        isRequired={isRequired}
        isLabelShowing={isLabelShowing}
        className={className}
      >
        <div>
          {options.map((option, index) => (
            <NpmCheckbox
              id={option.value}
              checked={value.some(({ value }) => option.value === value)}
              disabled={isDisabled}
              label={<DFormFieldLabel label={option.value} small />}
              onChange={({ target }) => onCheckboxChange(target.checked, option)}
              key={`${option.value}${index}`}
            />
          ))}
        </div>
      </DFormFieldContainer>
    );
  }

  return (
    <DFormFieldContainer
      id={id}
      label={label}
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
  options: OptionsType.isRequired,
  uiStyle: PropTypes.string,
  placeholder: PropTypes.string,
  isRequired: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  isLabelShowing: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
};
