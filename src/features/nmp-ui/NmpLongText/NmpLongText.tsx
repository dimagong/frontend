import "./styles.scss";

import classnames from "classnames";
import type { FC, CSSProperties, FormEvent } from "react";
import React, { useReducer, useRef, useState } from "react";

import { NpmModal, NpmEditor, NpmButton } from "features/nmp-ui";

type Props = {
  value?: string;
  isDisabled?: boolean;
  onChange?: (v: string) => void;
  style?: CSSProperties;
  className?: string;
};

export const NmpLongText: FC<Props> = (props) => {
  const { value, isDisabled, style, className, onChange } = props;

  const inputRef = useRef<HTMLDivElement>(null);
  const [inputHTML, setInputHTML] = useState("");
  const [inputValue, setInputValue] = useState(() => value ?? "");
  const [isModalOpen, toggleIsModalOpen] = useReducer((v) => !v, false);

  const classes = classnames("nmp-long-text__area", { "nmp-long-text__area--disabled": isDisabled }, className);

  const triggerOnChange = (value) => {
    if (onChange) {
      onChange(value);
    }
  };

  const onEditorChange = (v: string) => setInputValue(v);

  const closeModal = () => {
    toggleIsModalOpen();
    setInputHTML(inputValue);
    triggerOnChange(inputValue);
  };

  const onInput = ({ currentTarget }: FormEvent<HTMLDivElement>) => {
    triggerOnChange(currentTarget.innerHTML);
    setInputValue(currentTarget.innerHTML);
  };

  return (
    <>
      <div
        contentEditable={!isDisabled}
        placeholder="Enter your answer here"
        dangerouslySetInnerHTML={{ __html: inputHTML }}
        style={style}
        className={classes}
        onInput={onInput}
        ref={inputRef}
      />

      {isDisabled ? null : (
        <NpmModal
          title="Extended input"
          visible={isModalOpen}
          onCancel={closeModal}
          footer={
            <NpmButton type="nmp-primary" onClick={closeModal}>
              Close
            </NpmButton>
          }
        >
          <div className="pb-2">
            <NpmEditor
              data={value}
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
              onChange={onEditorChange}
              wrapperClassName="nmp-long-text__editor"
            />
          </div>
        </NpmModal>
      )}
    </>
  );
};
