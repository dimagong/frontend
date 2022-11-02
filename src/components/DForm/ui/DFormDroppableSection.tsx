import React from "react";
import type { FC, ReactNode } from "react";
import { Droppable } from "react-beautiful-dnd";

import { DFormElementTypes } from "../types";

type Props = {
  droppableId: string;
  children?: ReactNode;
};

export const DFormDroppableSection: FC<Props> = (props) => {
  const { droppableId, children } = props;

  return (
    <Droppable droppableId={droppableId} type={DFormElementTypes.Group}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          {children}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
