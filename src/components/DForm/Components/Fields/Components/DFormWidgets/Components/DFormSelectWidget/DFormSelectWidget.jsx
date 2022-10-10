import React from "react";
import PropTypes from "prop-types";

import { NmpSelect } from "features/nmp-ui";
import { IdType, OptionsType, OptionType } from "utility/prop-types";

import { DFormFieldContainer } from "../DFormFieldContainer";

import selectValidationSchema from "./validationSchema";

const defaultPlaceholder = "Select an option";

export const DFormSelectWidget = (props) => {
  const {
    id,
    value,
    label,
    options,
    isLoading = false,
    isRequired,
    isDisabled,
    isLabelShowing,
    placeholder = defaultPlaceholder,
    onChange,
    className,
  } = props;

  return (
    <DFormFieldContainer
      name={label}
      label={label}
      isRequired={isRequired}
      isLabelShowing={isLabelShowing}
      className={className}
    >
      <NmpSelect
        id={id}
        value={value?.value}
        loading={isLoading}
        options={options}
        disabled={isDisabled}
        placeholder={placeholder}
        onChange={(_, option) => onChange(option)}
      />
    </DFormFieldContainer>
  );
};

DFormSelectWidget.propTypes = {
  id: IdType.isRequired,
  value: OptionType,
  label: PropTypes.string,
  options: OptionsType.isRequired,
  placeholder: PropTypes.string,
  isLoading: PropTypes.bool,
  isRequired: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  isLabelShowing: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
};

DFormSelectWidget.validationSchema = selectValidationSchema;
