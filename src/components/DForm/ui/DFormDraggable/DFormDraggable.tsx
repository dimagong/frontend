import "./styles.scss";

import React from "react";
import type { FC, ReactNode } from "react";
import { Draggable } from "react-beautiful-dnd";
import { HolderOutlined } from "@ant-design/icons";

type Props = {
  index: number;
  draggableId: string;
  children?: ReactNode;
};

export const DFormDraggable: FC<Props> = (props) => {
  const { index, draggableId, children } = props;

  return (
    <Draggable index={index} draggableId={draggableId}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <div className="dform-draggable">
            <HolderOutlined {...provided.dragHandleProps} className="dform-draggable__drag-handle" />

            {children}
          </div>
        </div>
      )}
    </Draggable>
  );
};
