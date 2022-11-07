import React from "react";
import PropTypes from "prop-types";

import { NmpSelect, NmpCheckbox, NmpRow, NmpCol } from "features/nmp-ui";

import { IdType, OptionsType } from "utility/prop-types";

import multiSelectValidationSchema from "./validationSchema";

import { DFormFieldLabel } from "../DFormFieldLabel";
import { DFormFieldContainer } from "../DFormFieldContainer";

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
      <NmpCheckbox.Group value={value} disabled={isDisabled} onChange={onChange}>
        {options.map((option, index) => (
          <NmpRow key={`${option}${index}`}>
            <NmpCol>
              <NmpCheckbox value={option}>
                <DFormFieldLabel label={option} small />
              </NmpCheckbox>
            </NmpCol>
          </NmpRow>
        ))}
      </NmpCheckbox.Group>
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
        value={value}
        mode="multiple"
        options={options.map((option) => ({ label: option, value: option }))}
        disabled={isDisabled}
        allowClear
        placeholder="Select an option"
        onChange={onChange}
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
