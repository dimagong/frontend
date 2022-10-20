import "./styles.scss";

import React, { createRef } from "react";

import type { CSSProperties } from "react";

import type { FC } from "react";

import classnames from "classnames";

import { useTooltip } from "./../hooks/useTooltip";

import { NpmTooltip } from "./../NpmTooltip";

export type NmpTextType = {
  text?: string;
  className?: string;
  style?: CSSProperties;
};

export const NmpText: FC<NmpTextType> = ({ className, text = "", style, ...props }) => {
  const lableRef = createRef<HTMLDivElement>();

  const [isOpenTooltip, hendleMouseOver, handleMouseOut] = useTooltip(lableRef);

  return (
    <div className={classnames("nmp-text", className)} style={style}>
      <NpmTooltip title={text} visible={isOpenTooltip}>
        <span className="nmp-text__line" ref={lableRef} onMouseOver={hendleMouseOver} onMouseOut={handleMouseOut}>
          {text}
        </span>
      </NpmTooltip>
    </div>
  );
};
