import React, {useState, useEffect} from "react";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd"
import {
  ListGroup,
  ListGroupItem
} from "reactstrap"
import {PropertyNameByIdAsTextNode} from "../Parts/PropertyNameById";

const reorder = (list, startIndex, endIndex) => {

  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result
};

const reorderKeysObjectResult = (list, startIndex, endIndex, draggableKey) => {
  const listKeys = Object.keys(list);

  const result = Array.from(listKeys);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  const resultObject = {};
  result.forEach(keyValue => resultObject[keyValue] = list[keyValue]);

  return resultObject;
};

const reorderKeysArrayResult = (list, startIndex, endIndex, draggableKey) => {
  const listKeys = Object.keys(list);

  const result = Array.from(listKeys);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result.map(keyValue => list[keyValue]);
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


    if (props.isItemsArray) {
      setItems(reorderKeysArrayResult(
        items,
        result.source.index,
        result.destination.index,
        result.draggableId
      ));
    } else {
      setItems(reorderKeysObjectResult(
        items,
        result.source.index,
        result.destination.index,
        result.draggableId
      ));
    }

  };

  const renderOrderingObject = () => {
    return props.filterControlled && !props.filterKey ?
      null :
      Object.keys(items)
        .map((key, index) => {

          // some optional filtered settings props
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
                      {/*{ props.isMsField ? <PropertyNameByIdAsTextNode fieldId={key}/> : key}*/}
                      {key}
                    </ListGroupItem>
                  </div>
                )}
              </Draggable>
            </ListGroup>
          )
        })
  };

  const renderOrderingArray = () => {
    return props.filterControlled && !props.filterKey ?
      null :
      items
        .map((key, index) => {

          // some optional filter settings
          if (props.filterItems) {
            if (props.filterKey && props.filterKey !== props.filterItems[key]) {
              return null;
            }
          } else {
            if (props.filterKey && props.filterKey !== items[index]) {
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
                      { props.isMsField ? <PropertyNameByIdAsTextNode fieldId={key}/> : key}
                    </ListGroupItem>
                  </div>
                )}
              </Draggable>
            </ListGroup>
          )
        })
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
                props.isItemsArray ? renderOrderingArray() : renderOrderingObject()
              }
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default Ordering;
