import "./styles.scss";

import React from "react";
import classnames from "classnames";
import type { FC, ReactNode, CSSProperties, MouseEventHandler } from "react";

type Props = {
  isLeft?: boolean;
  isSelected?: boolean;
  isMishandled?: boolean;
  onClick?: MouseEventHandler;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
};

export const DFormSelectable: FC<Props> = (props) => {
  const { isLeft = false, isSelected = false, isMishandled = false, onClick, style, className, children } = props;

  const classes = classnames(
    "dform-selectable",
    {
      "dform-selectable--left": isLeft,
      "dform-selectable--selected": isSelected,
      "dform-selectable--mishandled": isMishandled,
    },
    className
  );

  return (
    <div style={style} className={classes}>
      <div className="dform-selectable__content" onClick={onClick}>
        {children}
      </div>
    </div>
  );
};
