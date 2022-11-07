import "./dform-draggable.scss";

import React from "react";
import classnames from "classnames";
import type { FC, ReactNode } from "react";
import { HolderOutlined } from "@ant-design/icons";
import type { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";

type Props = Partial<DraggableProvidedDragHandleProps> & {
  isMiddle?: boolean;
  isDraggable?: boolean;
  children?: ReactNode;
};

export const DFormDragHandle: FC<Props> = (props) => {
  const { isMiddle = false, isDraggable = false, children, ...dragHandleProps } = props;
  const classes = classnames("dform-draggable", { "dform-draggable--middle": isMiddle });

  if (!isDraggable) {
    return children as any;
  }

  return (
    <div className={classes}>
      <HolderOutlined {...dragHandleProps} className="dform-draggable__handle" />

      {children}
    </div>
  );
};
