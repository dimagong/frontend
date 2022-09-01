import "./styles.scss";

import PropTypes from "prop-types";
import classnames from "classnames";
import React, { useEffect, useState } from "react";

import { IdType } from "utility/prop-types";

import CustomModal from "components/CustomModal";
import WysiwygEditor from "components/FormCreate/Custom/WysiwygEditor";

import longTextValidationSchema from "./validationSchema";

import { DFormFieldLabel } from "../DFormFieldLabel";
import { DFormFieldContainer } from "../DFormFieldContainer";

export const DFormLongTextWidget = (props) => {
  const { id, value = "", label, error, isError, isRequired, isDisabled, isLabelShowing, onChange, className } = props;

  const inputRef = React.useRef();
  const [inputHTML, setInputHTML] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isModalOpened, setIsModalOpened] = useState(false);

  const handleOnChange = (value) => onChange(value);

  const wysiwygChange = (event) => {
    setInputValue(event);
  };

  const handleModalClose = () => {
    setIsModalOpened(false);
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
        className={classnames("dform-long-text-widget__area", { "dform-long-text-widget__area--disabled": isDisabled })}
        placeholder="Enter your answer here"
        dangerouslySetInnerHTML={{ __html: inputHTML }}
        onInput={onInput}
      />

      {isDisabled ? null : (
        <>
          <div className="d-flex justify-content-end">
            <button onClick={() => setIsModalOpened(true)}>Expand text area</button>
          </div>

          <CustomModal
            size="lg"
            submitBtnText="Close"
            title="Extended input"
            isOpen={isModalOpened}
            onClose={handleModalClose}
            onSubmit={handleModalClose}
          >
            <div className="pb-2">
              {isLabelShowing ? (
                <DFormFieldLabel label={label} isError={isError} isRequired={isRequired} className="modal-label" />
              ) : null}

              <WysiwygEditor
                type="text"
                data={inputValue}
                toolbar={{
                  options: ["inline", "list", "textAlign", "link"],
                  inline: {
                    inDropdown: false,
                    options: ["bold", "italic", "underline"],
                  },
                  textAlign: {
                    inDropdown: false,
                    options: ["indent", "outdent"],
                  },
                }}
                onChange={wysiwygChange}
                wrapperClassName="dform-long-text-widget__editor"
              />
            </div>
          </CustomModal>
        </>
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
