import React from "react";
import classnames from "classnames";
import type { FC, CSSProperties } from "react";
import { HolderOutlined } from "@ant-design/icons";
import type { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";

type Props = Partial<DraggableProvidedDragHandleProps> & {
  style?: CSSProperties;
  className?: string;
};

export const DFormDragHandle: FC<Props> = (props) => {
  const { style, className, ...dragHandleProps } = props;
  return (
    <HolderOutlined
      {...dragHandleProps}
      style={style}
      className={classnames("dform-draggable__drag-handle", className)}
    />
  );
};
