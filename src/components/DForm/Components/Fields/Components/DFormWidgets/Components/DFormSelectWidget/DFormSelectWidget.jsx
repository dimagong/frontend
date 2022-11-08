import React from "react";

import { NmpSelect } from "features/nmp-ui";

import { DFormFieldContainer } from "../DFormFieldContainer";

import selectValidationSchema from "./validationSchema";

const defaultPlaceholder = "Select an option";

export const DFormSelectWidget = (props) => {
  const {
    id,
    value,
    label,
    error,
    options,
    isError,
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
        loading={isLoading}
        options={options.map((option) => ({ label: option, value: option }))}
        disabled={isDisabled}
        placeholder={placeholder}
        onChange={onChange}
      />
    </DFormFieldContainer>
  );
};

DFormSelectWidget.validationSchema = selectValidationSchema;
