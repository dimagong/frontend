import React from "react";
import PropTypes from "prop-types";

import { IdType, OptionsType } from "utility/prop-types";
import { NmpSelect, NmpCheckbox, NmpRow, NmpCol } from "features/nmp-ui";

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

  if (uiStyle === "checkboxes") {
    return (
      <DFormFieldContainer
        id={id}
        label={label}
        isRequired={isRequired}
        isLabelShowing={isLabelShowing}
        className={className}
      >
        <NmpCheckbox.Group
          name={id}
          value={value.map(({ value }) => value)}
          disabled={isDisabled}
          onChange={(values) => onChange(values.map((value) => ({ value, label: value })))}
        >
          {options.map((option, index) => (
            <NmpRow key={`${option.value}${index}`}>
              <NmpCol>
                <NmpCheckbox value={option.value}>
                  <DFormFieldLabel label={option.value} small />
                </NmpCheckbox>
              </NmpCol>
            </NmpRow>
          ))}
        </NmpCheckbox.Group>
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
