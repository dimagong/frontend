import React from "react";
import type { FC, ReactNode } from "react";
import { Droppable } from "react-beautiful-dnd";

import { DFormElementTypes } from "../../types";

type Props = {
  droppableId: string;
  isDraggable?: boolean;
  children?: ReactNode;
};

export const DFormDroppableGroup: FC<Props> = (props) => {
  const { droppableId, isDraggable, children } = props;

  if (!isDraggable) {
    return children || (null as any);
  }

  return (
    <Droppable droppableId={droppableId} type={DFormElementTypes.Block}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          {children}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
