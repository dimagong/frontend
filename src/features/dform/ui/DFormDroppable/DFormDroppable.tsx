import React from "react";
import type { FC, ReactNode } from "react";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";

type Props = {
  droppableId: string;
  droppableType: string;
  isDraggable?: boolean;
  children?: ReactNode | ((placeholder?: DroppableProvided["placeholder"]) => ReactNode);
};

export const DFormDroppable: FC<Props> = (props) => {
  const { droppableId, droppableType, isDraggable = true, children } = props;

  if (!isDraggable) {
    return typeof children === "function" ? children() : children || (null as any);
  }

  return (
    <Droppable droppableId={droppableId} type={droppableType}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          {typeof children === "function" ? (
            children(provided.placeholder)
          ) : (
            <>
              {children}
              {provided.placeholder}
            </>
          )}
        </div>
      )}
    </Droppable>
  );
};
