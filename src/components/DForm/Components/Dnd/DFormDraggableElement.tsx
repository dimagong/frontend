import React from "react";
import type { FC } from "react";
import { Draggable, DraggableProvided } from "react-beautiful-dnd";
import classnames from "classnames";

import { HolderOutlined } from "@ant-design/icons";

type DFormDraggableElementProps = {
  draggableId: string;
  index: number;
  classname?: string;
  dragIconClasses?: string;
  title?: JSX.Element;
  children?: JSX.Element;
};

type DraggableWithTitleProps = Omit<DFormDraggableElementProps, "index" | "draggableId"> & {
  provided: DraggableProvided;
};

const DraggableWithTitle: FC<DraggableWithTitleProps> = ({ provided, classname, dragIconClasses, title, children }) => {
  return (
    <div ref={provided.innerRef} {...provided.draggableProps} className={classname}>
      <div className="d-flex">
        <span className={dragIconClasses} {...provided.dragHandleProps}>
          <HolderOutlined />
        </span>
        {title}
      </div>

      {children}
    </div>
  );
};

export const DFormDraggableElement: FC<DFormDraggableElementProps> = ({
  draggableId,
  classname,
  dragIconClasses,
  index,
  children,
  title,
}) => {
  return (
    <Draggable key={draggableId} draggableId={draggableId} index={index}>
      {(provided) =>
        title ? (
          <DraggableWithTitle provided={provided} classname={classname} title={title} dragIconClasses={dragIconClasses}>
            {children}
          </DraggableWithTitle>
        ) : (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={classnames("dform-dnd__wrapper", classname)}
          >
            <span className={dragIconClasses} {...provided.dragHandleProps}>
              <HolderOutlined />
            </span>
            {children}
          </div>
        )
      }
    </Draggable>
  );
};
