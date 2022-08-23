import "./styles.scss";

import React, { useEffect, useState } from "react";

import FieldLabel from "../FieldLabel";

import CustomModal from "components/CustomModal";
import WysiwygEditor from "components/FormCreate/Custom/WysiwygEditor";

import longTextValidationSchema from "./validationSchema";

const LongText = (props) => {
  const { value, onChange, label, isRequired } = props;

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

  useEffect(() => {
    if (!inputValue) {
      setInputHTML(value);
      setInputValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className={"long-text-area-container"}>
      <FieldLabel label={label} required={isRequired} />
      <div className="custom-form-filed form-create_custom-text-widget custom-long-text-area-widget">
        <div
          className={"textarea custom-longtext"}
          ref={inputRef}
          contentEditable
          dangerouslySetInnerHTML={{ __html: inputHTML }}
          placeholder={"Enter your answer here"}
          onInput={() => {
            let obj = inputRef.current;
            handleOnChange(obj.innerHTML);
            setInputValue(obj.innerHTML);
          }}
        />
      </div>
      <span className={"long-text-area-open-more"} onClick={() => setIsModalOpened(true)}>
        Expand text area
      </span>

      <CustomModal
        className="long-text-modal-window"
        isOpen={isModalOpened}
        onClose={handleModalClose}
        submitBtnText="Close"
        onSubmit={handleModalClose}
        title="Extended input"
      >
        <div className="custom-form-filed form-create_custom-text-widget custom-long-text-area-widget modal-long-text-area-widget">
          <h2 className="modal-label">
            {label} {!!isRequired && <span className="field-label_asterix">*</span>}
          </h2>
          <WysiwygEditor
            type={"text"}
            data={inputValue}
            onChange={(event) => wysiwygChange(event)}
            className="form-control"
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
          />
        </div>
      </CustomModal>
    </div>
  );
};

LongText.validationSchema = longTextValidationSchema;

export default LongText;
