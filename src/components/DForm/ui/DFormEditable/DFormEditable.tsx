import "./styles.scss";

import React from "react";
import classnames from "classnames";
import type { FC, ReactNode, MouseEventHandler } from "react";

import { DFormDraggable } from "../DFormDraggable";

type Props = {
  editableId: string;
  editableIndex: number;
  isSelected?: boolean;
  isDraggable?: boolean;
  isMishandled?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
  children?: ReactNode;
};

export const DFormEditable: FC<Props> = (props) => {
  const {
    editableId,
    editableIndex,
    isSelected = false,
    isDraggable = false,
    isMishandled = false,
    onClick,
    children,
  } = props;
  const classes = classnames("dform-editable", {
    "dform-editable--selected": isSelected,
    "dform-editable--mishandled": isMishandled,
  });

  const Selectable = (
    <div className={classes}>
      <div className="dform-editable__content" onClick={onClick}>
        {children}
      </div>
    </div>
  );

  if (isDraggable) {
    return (
      <DFormDraggable draggableId={editableId} draggableIndex={editableIndex}>
        {Selectable}
      </DFormDraggable>
    );
  }

  return Selectable;
};
