import React from "react";
import type { FC, ReactNode } from "react";
import { Draggable, DraggableProvidedDragHandleProps, DraggableStateSnapshot } from "react-beautiful-dnd";

type Props = {
  draggableId: string;
  isDraggable?: boolean;
  draggableIndex: number;
  children?: (dragHandleProps?: DraggableProvidedDragHandleProps, state?: DraggableStateSnapshot) => ReactNode;
};

export const DFormDraggable: FC<Props> = (props) => {
  const { draggableId, isDraggable = true, draggableIndex, children } = props;

  if (!isDraggable) {
    return children ? children() : (null as any);
  }

  return (
    <Draggable index={draggableIndex} draggableId={draggableId}>
      {(provided, state) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          {children ? children(provided.dragHandleProps, state) : null}
        </div>
      )}
    </Draggable>
  );
};
