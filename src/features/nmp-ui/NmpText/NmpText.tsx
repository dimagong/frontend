import "./styles.scss";

import classnames from "classnames";
import type { FC, CSSProperties } from "react";
import React, { useRef, useState } from "react";

import { NpmTooltip } from "../NpmTooltip";

export type NmpTextProps = {
  text?: string;
  style?: CSSProperties;
  className?: string;
};

export const NmpText: FC<NmpTextProps> = ({ text = "", style, className }) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const onMouseOver = () => {
    if (!textRef.current) return;

    const { clientWidth, scrollWidth } = textRef.current;
    const diffWidth = scrollWidth - clientWidth;

    if (diffWidth > 0) {
      setIsVisible(true);
    }
  };

  const onMouseOut = () => setIsVisible(false);

  return (
    <div className={classnames("nmp-text", className)} style={style}>
      <NpmTooltip title={text} visible={isVisible}>
        <span className="nmp-text__line" ref={textRef} onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
          {text}
        </span>
      </NpmTooltip>
    </div>
  );
};
