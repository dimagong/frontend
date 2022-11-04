import React from "react";
import type { FC, ReactNode } from "react";
import { Draggable, DraggableProvidedDragHandleProps } from "react-beautiful-dnd";

type Props = {
  draggableId: string;
  isDraggable?: boolean;
  draggableIndex: number;
  children?: (dragHandleProps?: DraggableProvidedDragHandleProps) => ReactNode;
};

export const DFormDraggable: FC<Props> = (props) => {
  const { draggableId, isDraggable = true, draggableIndex, children } = props;

  if (!isDraggable) {
    return children ? children() : (null as any);
  }

  return (
    <Draggable index={draggableIndex} draggableId={draggableId}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          {children ? children(provided.dragHandleProps) : null}
        </div>
      )}
    </Draggable>
  );
};
