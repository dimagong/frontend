import {Button} from "react-bootstrap";
import React, {useState} from "react";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd"
import {Card, CardHeader, CardBody, CardTitle} from "reactstrap"

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result
};

function Sortable(props) {
  const [direction, setDirection] = useState('horizontal');
  const [items, setItems] = useState(props.items);

  console.log(props.items);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return
    }
    console.log(items, result);
    setItems(reorder(
      items,
      result.source.index,
      result.destination.index
    ));
  };

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction={direction}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="d-flex flex-sm-wrap flex-lg-nowrap draggable-cards"
            >
              {Object.keys(items).map((key, index) => (
                <Draggable key={key} draggableId={key} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Card
                        className={`draggable-cards ${
                          key !== 4 ? "mr-1" : null
                        }`}
                      >
                        <CardHeader>
                          <CardTitle>{key}</CardTitle>
                        </CardHeader>
                        <CardBody></CardBody>
                      </Card>
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
}

export default Sortable;
