import "./styles.scss";

import React, { createRef, CSSProperties } from "react";

import classnames from "classnames";

import { useTooltip } from "hooks/useTooltip";

import { NpmTooltip } from "./../NpmTooltip";

type NmpTextType = {
  text?: string;
  className?: string;
  style: CSSProperties;
};

export const NmpText: React.FC<NmpTextType> = ({ className, text = "", ...props }) => {
  const lableRef = createRef<HTMLDivElement>();

  const [isOpenTooltip, hendleMouseOver, handleMouseOut] = useTooltip(lableRef);

  return (
    <NpmTooltip visible={isOpenTooltip as boolean} title={text}>
      <div
        className={classnames("nmp-text", className)}
        ref={lableRef}
        onMouseOver={hendleMouseOver as () => void}
        onMouseOut={handleMouseOut as () => void}
      >
        <span>{text}</span>
      </div>
    </NpmTooltip>
  );
};
