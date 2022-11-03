import "./dform-drag-handle.scss";

import React from "react";
import { HolderOutlined } from "@ant-design/icons";
import type { FC, CSSProperties } from "react";
import type { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";

type Props = Partial<DraggableProvidedDragHandleProps> & {
  style?: CSSProperties;
  className?: string;
};

export const DFormDragHandle: FC<Props> = (props) => {
  const { style, className, ...dragHandleProps } = props;

  return <HolderOutlined {...dragHandleProps} className="dform-drag-handle" />;
};
