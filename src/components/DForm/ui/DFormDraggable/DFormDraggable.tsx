import "./styles.scss";

import React from "react";
import type { FC, ReactNode } from "react";
import { Draggable } from "react-beautiful-dnd";
import { HolderOutlined } from "@ant-design/icons";

type Props = {
  draggableId: string;
  draggableIndex: number;
  children?: ReactNode;
};

export const DFormDraggable: FC<Props> = (props) => {
  const { draggableId, draggableIndex, children } = props;

  return (
    <Draggable index={draggableIndex} draggableId={draggableId}>
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
