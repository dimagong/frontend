import "./styles.scss";

import classnames from "classnames";
import React, { useRef, useState } from "react";
import type { FC, CSSProperties, FormEvent } from "react";

import { NmpModal, NmpWysiwygEditor, NmpButton } from "features/nmp-ui";

export type NmpLongTextProps = {
  id?: string;
  value?: string;
  isDisabled?: boolean;
  onChange?: (v: string) => void;
  style?: CSSProperties;
  className?: string;
};

export const NmpLongText: FC<NmpLongTextProps> = (props) => {
  const { id, value, isDisabled, style, className, onChange } = props;

  const divRef = useRef<HTMLDivElement>(null);
  const [contentValue, setContentValue] = useState(() => value ?? "");
  const [editorValue, setEditorValue] = useState(() => value ?? "");

  const classes = classnames("nmp-long-text__area", { "nmp-long-text__area--disabled": isDisabled }, className);

  const onInput = ({ currentTarget }: FormEvent<HTMLDivElement>) => {
    const value = currentTarget.innerHTML;

    setEditorValue(value);

    if (onChange) {
      onChange(value);
    }
  };

  const onEditorChange = (editorValue: string) => {
    setContentValue(editorValue);

    if (onChange) {
      onChange(editorValue);
    }
  };

  const openModal = () => {
    NmpModal.open({
      title: "Extended input",
      content: (
        <NmpWysiwygEditor
          value={editorValue}
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
          wrapperClassName="nmp-long-text__editor-wrapper"
        />
      ),
      centered: true,
    });
  };

  const onInputBlur = () => divRef.current?.blur();

  const onInputFocus = () => divRef.current?.focus();

  return (
    <>
      <input
        id={id}
        type="text"
        readOnly
        disabled={isDisabled}
        onBlur={onInputBlur}
        onFocus={onInputFocus}
        className="nmp-long-text__input"
      />

      <div
        contentEditable={!isDisabled}
        placeholder="Enter your answer here"
        dangerouslySetInnerHTML={{ __html: contentValue }}
        style={style}
        className={classes}
        onInput={onInput}
        ref={divRef}
      />

      {isDisabled ? null : (
        <div className="nmp-long-text__actions">
          <NmpButton type="nmp-primary" onClick={openModal}>
            Expand text area
          </NmpButton>
        </div>
      )}
    </>
  );
};
