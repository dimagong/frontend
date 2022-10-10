import React from "react";
import PropTypes from "prop-types";

import { NmpInput } from "features/nmp-ui";
import { IdType } from "utility/prop-types";

import { DFormFieldContainer } from "../DFormFieldContainer";

const defaultPlaceholder = "Enter your answer here";

export const DFormNumberWidget = (props) => {
  const {
    id,
    value = "",
    label,
    isRequired,
    isDisabled,
    isLabelShowing,
    placeholder = defaultPlaceholder,
    onChange: propOnChange,
    className,
  } = props;

  const onChange = (event) => propOnChange(event.target.value);

  return (
    <DFormFieldContainer
      name={label}
      label={label}
      isRequired={isRequired}
      isLabelShowing={isLabelShowing}
      className={className}
    >
      <NmpInput
        id={id}
        type="number"
        value={value}
        disabled={isDisabled}
        placeholder={placeholder}
        onChange={onChange}
        className="dform-number-field"
      />
    </DFormFieldContainer>
  );
};

DFormNumberWidget.propTypes = {
  id: IdType.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string,
  isRequired: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  isLabelShowing: PropTypes.bool.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};
