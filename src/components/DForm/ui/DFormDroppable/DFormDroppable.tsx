import React from "react";
import type { FC, ReactNode } from "react";
import { Droppable } from "react-beautiful-dnd";

type Props = {
  droppableId: string;
  droppableType: string;
  isDraggable?: boolean;
  children?: ReactNode;
};

export const DFormDroppable: FC<Props> = (props) => {
  const { droppableId, droppableType, isDraggable = true, children } = props;

  if (!isDraggable) {
    return children || (null as any);
  }

  return (
    <Droppable droppableId={droppableId} type={droppableType}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          {children}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
