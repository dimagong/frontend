import React from "react";
import PropTypes from "prop-types";

import { NmpSelect } from "features/nmp-ui";
import { IdType, OptionsType, OptionType } from "utility/prop-types";

import { DFormItem } from "../DFormItem";

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
    masterSchemaFieldId,
    onChange,
    className,
  } = props;

  return (
    <DFormItem
      name={masterSchemaFieldId}
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
        placeholder={defaultPlaceholder}
        onChange={(_, option) => onChange(option)}
      />
    </DFormItem>
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
  className: PropTypes.string,
};

DFormSelectWidget.validationSchema = selectValidationSchema;
