import "./styles.scss";

import React from "react";
import classnames from "classnames";
import type { FC, ReactNode, MouseEventHandler } from "react";

type Props = {
  isSelected?: boolean;
  isMishandled?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
  children?: ReactNode;
};

export const DFormSelectable: FC<Props> = (props) => {
  const { isSelected = false, isMishandled = false, onClick, children } = props;

  const classes = classnames("dform-selectable", {
    "dform-selectable--selected": isSelected,
    "dform-selectable--mishandled": isMishandled,
  });

  return (
    <div className={classes}>
      <div className="dform-selectable__content" onClick={onClick}>
        {children}
      </div>
    </div>
  );
};
