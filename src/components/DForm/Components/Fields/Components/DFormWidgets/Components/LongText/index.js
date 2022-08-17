import React, { useEffect, useState } from "react";
import longTextValidationSchema from "./validationSchema";

import FieldLabel from "../FieldLabel";

import "./styles.scss";
import WysiwygEditor from "components/FormCreate/Custom/WysiwygEditor";
import CustomModal from "components/CustomModal";
import { DFormWidgetEventsTypes } from "../../events";

const LongText = (props) => {
  const { value, onEvent, label, isRequired } = props;
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputHTML, setInputHTML] = useState("");
  const inputRef = React.useRef();

  const handleOnChange = (value) => {
    onEvent({ type: DFormWidgetEventsTypes.Change, value });
  };

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
        className={"long-text-modal-window"}
        isOpen={isModalOpened}
        onClose={handleModalClose}
        submitBtnText={"Close"}
        onSubmit={handleModalClose}
        title={"Extended input"}
      >
        <div className="custom-form-filed form-create_custom-text-widget custom-long-text-area-widget modal-long-text-area-widget">
          <h2 className={"modal-label"}>
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
