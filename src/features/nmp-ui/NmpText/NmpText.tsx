import "./styles.scss";

import classnames from "classnames";
import type { FC, CSSProperties } from "react";
import React, { useRef, useState } from "react";

import { NpmTooltip } from "../NpmTooltip";

export type NmpTextProps = {
  text?: string;
  isTipShow?: boolean;
  style?: CSSProperties;
  className?: string;
};

export const NmpText: FC<NmpTextProps> = ({ text = "", isTipShow = false, style, className }) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const onMouseOver = () => {
    if (!textRef.current) return;

    const { clientWidth, scrollWidth } = textRef.current;
    const diffWidth = scrollWidth - clientWidth;

    if (diffWidth > 0) {
      setIsOpen(true);
    }
  };

  const onMouseOut = () => setIsOpen(false);

  return (
    <span className={classnames("nmp-text", className)} style={style}>
      <NpmTooltip title={text} open={isOpen && isTipShow}>
        <span className="nmp-text__line" ref={textRef} onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
          {text}
        </span>
      </NpmTooltip>
    </span>
  );
};
