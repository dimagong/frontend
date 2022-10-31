import React from "react";
import type { FC, ReactNode } from "react";
import { Droppable } from "react-beautiful-dnd";

import { ElementTypes } from "../types/elementTypes";

type Props = {
  droppableId: string;
  children?: ReactNode;
};

export const DFormDroppableSection: FC<Props> = (props) => {
  const { droppableId, children } = props;

  return (
    <Droppable droppableId={droppableId} type={ElementTypes.Group}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          {children}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
