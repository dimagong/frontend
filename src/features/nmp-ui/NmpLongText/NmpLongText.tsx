import "./styles.scss";

import classnames from "classnames";
import React, { useRef, useState } from "react";
import type { FC, CSSProperties, FormEvent } from "react";

import { NmpModal, NpmEditor, NmpButton } from "features/nmp-ui";

type Props = {
  id?: string;
  value?: string;
  isDisabled?: boolean;
  onChange?: (v: string) => void;
  style?: CSSProperties;
  className?: string;
};

export const NmpLongText: FC<Props> = (props) => {
  const { id, value, isDisabled, style, className, onChange } = props;

  const divRef = useRef<HTMLDivElement>(null);
  const [innerValue, setInnerValue] = useState(() => value);

  const classes = classnames("nmp-long-text__area", { "nmp-long-text__area--disabled": isDisabled }, className);

  const triggerOnChange = (value) => {
    if (onChange) {
      onChange(value);
    }
    setInnerValue(value);
  };

  const openModal = () => {
    NmpModal.open({
      title: "Extended input",
      content: (
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
          onChange={triggerOnChange}
          wrapperClassName="nmp-long-text__editor-wrapper"
        />
      ),
      centered: true,
    });
  };

  const onInput = ({ currentTarget }: FormEvent<HTMLDivElement>) => {
    if (onChange) {
      onChange(currentTarget.innerHTML);
    }
  };

  const onInputBlur = () => divRef.current?.blur();

  const onInputFocus = () => divRef.current?.focus();

  return (
    <>
      <input
        id={id}
        type="text"
        value={value}
        readOnly
        onBlur={onInputBlur}
        onFocus={onInputFocus}
        className="nmp-long-text__input"
      />

      <div
        contentEditable={!isDisabled}
        placeholder="Enter your answer here"
        dangerouslySetInnerHTML={{ __html: innerValue ?? "" }}
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
