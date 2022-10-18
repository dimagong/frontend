import "./styles.scss";

import React, { createRef, CSSProperties } from "react";

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
    <NpmTooltip visible={isOpenTooltip} title={text}>
      <div
        className={classnames("nmp-text", className)}
        ref={lableRef}
        onMouseOver={hendleMouseOver}
        onMouseOut={handleMouseOut}
        style={style}
      >
        {text}
      </div>
    </NpmTooltip>
  );
};
