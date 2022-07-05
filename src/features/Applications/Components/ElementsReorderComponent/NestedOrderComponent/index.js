import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { DragIndicator, ExpandLess, ExpandMore } from "@material-ui/icons";
import { Collapse } from "reactstrap";
import { useToggleable } from "hooks/use-toggleable";

import "./styles.scss";

const NestedOrderComponent = ({
  onDragEnd,
  items,
  isNested = false,
  elementNameSelector,
  children,
  type,
  childItemsSelector,
  parentItem,
}) => {
  const itemsToRender = items || childItemsSelector(parentItem);

  let initialKeys = [];

  if (isNested) {
    initialKeys = itemsToRender.map((item) => item.id);
  }

  const [keys, { toggle }] = useToggleable(initialKeys, { useRefactored: true });

  const handleDragEnd = (props) => {
    onDragEnd({ ...props, parentItem });
  };

  return (
    <div className="nested-draggable-list">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable" type={type}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {itemsToRender.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div className="nested-draggable-list_item" ref={provided.innerRef} {...provided.draggableProps}>
                      <div className="nested-draggable-list_item-name">
                        <span className="nested-draggable-list_item-drag-icon" {...provided.dragHandleProps}>
                          <DragIndicator />
                        </span>
                        {elementNameSelector ? elementNameSelector(item) : item.name}

                        {!!children && (
                          <span className="cursor-pointer" onClick={() => toggle(item.id)}>
                            {keys.includes(item.id) ? <ExpandMore /> : <ExpandLess />}
                          </span>
                        )}
                      </div>
                      {!!children && (
                        <Collapse isOpen={!keys.includes(item.id)}>
                          <div className="nested-draggable-list_item-children">
                            {React.cloneElement(children, { parentItem: item })}
                          </div>
                        </Collapse>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default NestedOrderComponent;
