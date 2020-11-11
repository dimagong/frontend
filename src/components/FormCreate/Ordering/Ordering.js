import {Button} from "react-bootstrap";
import React, {useState, useEffect} from "react";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd"
import {
  Card, CardHeader, CardBody, CardTitle, ListGroup,
  ListGroupItem
} from "reactstrap"

const reorder = (list, startIndex, endIndex) => {

  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result
};

const reorderKeys = (list, startIndex, endIndex, draggableKey) => {
  const listKeys = Object.keys(list);

  const result = Array.from(listKeys);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  const resultObject = {};
  result.forEach(keyValue => resultObject[keyValue] = list[keyValue]);
  return resultObject;
};


function Ordering(props) {
  const [direction, setDirection] = useState('vertical');
  const [deviceWidth, setDeviceWidth] = useState(window.width);
  const [items, setItems] = useState(props.items);

  const modalContainer = React.createRef();


  const updateWidth = () => {
    setDeviceWidth(modalContainer.current.scrollWidth);
  };

  useEffect(() => {
    updateWidth();

  });

  useEffect(() => {
    props.onDragEnd(items);
  }, [items]);


  const onDragEnd = (result) => {
    if (!result.destination) {
      return
    }

    setItems(reorderKeys(
      items,
      result.source.index,
      result.destination.index,
      result.draggableId
    ));

  };

  return (
    <div ref={modalContainer}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction={direction}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="d-flex flex-sm-wrap draggable-cards"
            >
              {
                props.filterControlled && !props.filterKey ?
                  null :
                  Object.keys(items)
                    .map((key, index) => {
                      if (props.filterItems) {
                        if (props.filterKey && props.filterKey !== props.filterItems[key]) {
                          return null;
                        }
                      } else {
                        if (props.filterKey && props.filterKey !== items[key]) {
                          return null;
                        }
                      }
                      return (
                        <ListGroup tag="div">
                          <Draggable key={key} draggableId={key} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => {
                                  props.onChangeFilterKey && props.onChangeFilterKey(key)
                                }}
                              >
                                <ListGroupItem style={{width: deviceWidth}} tag="div" active={props.selfKey === key}>
                                  {key}
                                </ListGroupItem>
                              </div>
                            )}
                          </Draggable>
                        </ListGroup>
                      )
                    })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default Ordering;
