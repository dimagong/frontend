import "./styles.scss";

import React from "react";
import type { FC, ReactNode } from "react";
import { Draggable } from "react-beautiful-dnd";

import { DFormDragHandle } from "./DFormDragHandle";

type Props = {
  wrapper?: (node: ReactNode) => ReactNode;
  draggableId: string;
  isDraggable?: boolean;
  draggableIndex: number;
  children?: ReactNode;
};

export const DFormDraggable: FC<Props> = (props) => {
  const { wrapper, draggableId, isDraggable = true, draggableIndex, children } = props;

  if (!isDraggable) {
    return (wrapper ? wrapper(children) : children) || (null as any);
  }

  return (
    <Draggable index={draggableIndex} draggableId={draggableId}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          {wrapper ? (
            wrapper(
              <div className="dform-draggable__area">
                <DFormDragHandle {...provided.dragHandleProps} />

                {children}
              </div>
            )
          ) : (
            <div className="dform-draggable__area">
              <DFormDragHandle {...provided.dragHandleProps} />

              {children}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};
