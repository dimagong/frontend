import "./styles.scss";

import PropTypes from "prop-types";
import classnames from "classnames";
import React, { useEffect, useReducer, useState } from "react";

import { IdType } from "utility/prop-types";

import { NpmButton, NmpLongTextModal } from "features/nmp-ui";

import { DFormFieldContainer } from "../DFormFieldContainer";

import longTextValidationSchema from "./validationSchema";

export const DFormLongTextWidget = (props) => {
  const { id, value = "", label, error, isError, isRequired, isDisabled, isLabelShowing, onChange, className } = props;

  const inputRef = React.useRef();
  const [inputHTML, setInputHTML] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isModalOpened, toggleIsModalOpened] = useReducer((v) => !v, false);

  const handleOnChange = (value) => onChange(value);

  const wysiwygChange = (event) => {
    setInputValue(event);
  };

  const handleModalClose = () => {
    toggleIsModalOpened();
    setInputHTML(inputValue);
    handleOnChange(inputValue);
  };

  const onInput = () => {
    let obj = inputRef.current;
    handleOnChange(obj.innerHTML);
    setInputValue(obj.innerHTML);
  };

  useEffect(() => {
    if (!inputValue) {
      setInputHTML(value);
      setInputValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

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
      <div
        ref={inputRef}
        contentEditable={!isDisabled}
        placeholder="Enter your answer here"
        className={classnames("dform-long-text-widget__area", { "dform-long-text-widget__area--disabled": isDisabled })}
        dangerouslySetInnerHTML={{ __html: inputHTML }}
        onInput={onInput}
      />

      {isDisabled ? null : (
        <div className="dform-long-text-widget__actions">
          <NpmButton type="nmp-primary" onClick={toggleIsModalOpened}>
            Expand text area
          </NpmButton>

          <NmpLongTextModal
            value={inputValue}
            isModalOpen={isModalOpened}
            onCancel={handleModalClose}
            onEditChange={wysiwygChange}
            editorClassName="dform-long-text-widget__editor"
          />
        </div>
      )}
    </DFormFieldContainer>
  );
};

DFormLongTextWidget.propTypes = {
  id: IdType.isRequired,
  value: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  isError: PropTypes.bool.isRequired,
  isRequired: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  isLabelShowing: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
};

DFormLongTextWidget.validationSchema = longTextValidationSchema;
