import "./styles.scss";

import React from "react";
import { Plus } from "react-feather";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Collapse } from "reactstrap";

import { DragIndicator } from "@material-ui/icons";

import { ElementTypes } from "components/DForm";

import Fields from "../Fields";
import { useDFormContext } from "../../DFormContext";

import classnames from "classnames";

const Groups = (props) => {
  const {
    data,
    sectionId,
    isDisabled: propIsDisabled,
    sectionGroups,
    selectedElement,
    onElementClick,
    onGroupCreate,
    onFieldCreate,
    isCollapsed,
  } = props;

  const { isConfigurable } = useDFormContext();

  const onGroupSelect = (groupId) => {
    if (!onElementClick) return;

    const group = data.groups[groupId];

    onElementClick({ ...group, sectionId }, "group");
  };

  return (
    <div className="w-100">
      {sectionGroups.map((groupId, index) => {
        const group = data.groups[groupId];

        if (group.isHidden) {
          return null;
        }

        const isDisabled = propIsDisabled || Boolean(group.isDisabled);
        const isSelected = selectedElement?.elementType === ElementTypes.Group && selectedElement?.id === group.id;
        const isLastGroup = sectionGroups.length - 1 === index;

        return (
          <Draggable key={groupId} draggableId={groupId} index={index}>
            {(provided) => (
              <div className="group" key={groupId} {...provided.draggableProps} ref={provided.innerRef}>
                <div className="draggable-wrapper">
                  <span className="nested-draggable-list_item-drag-icon group-drag-icon" {...provided.dragHandleProps}>
                    <DragIndicator />
                  </span>
                  <div
                    className={`group-title editable ${isSelected ? "selected" : ""}`}
                    onClick={() => onGroupSelect(groupId)}
                  >
                    <span className="text-bold-500">{data.groups[groupId].name}</span>
                  </div>
                </div>

                <Collapse isOpen={!isCollapsed} key={groupId}>
                  <Droppable
                    droppableId={groupId}
                    type={ElementTypes.Field}
                    renderClone={(provided, snapshot, rubric) => (
                      <div {...provided.draggableProps} ref={provided.innerRef}>
                        <div className="draggable-wrapper">
                          <span
                            className="nested-draggable-list_item-drag-icon group-drag-icon"
                            {...provided.dragHandleProps}
                          >
                            <DragIndicator />
                          </span>
                          <div className={"group-title group-title--draggable"}>
                            <span className="text-bold-500">{data.fields[rubric.draggableId].title}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  >
                    {(provided) => (
                      <div className="group-content row mr-0 ml-0" {...provided.droppableProps} ref={provided.innerRef}>
                        <Fields
                          data={data}
                          groupId={groupId}
                          isDisabled={isDisabled}
                          selectedElement={selectedElement}
                          groupFields={group.relatedFields}
                          onFieldCreate={onFieldCreate}
                          onElementClick={onElementClick}
                        />
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  {isConfigurable ? (
                    <div className={classnames("btn-box", { "btn-group": isLastGroup })}>
                      <div className="element-add" onClick={() => onFieldCreate(groupId)}>
                        <div className="element-add_icon">
                          <Plus color="white" size={23} />
                        </div>
                        <div className="element-add_description">Add new form element</div>
                      </div>
                      {isLastGroup ? (
                        <div className="element-add" onClick={onGroupCreate}>
                          <div className="element-add_icon">
                            <Plus color="white" size={23} />
                          </div>
                          <div className="element-add_description">Add new group</div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </Collapse>
              </div>
            )}
          </Draggable>
        );
      })}

      {!sectionGroups || sectionGroups.length === 0 ? (
        <div className="px-2 py-5 text-center w-100">There are no groups in this section</div>
      ) : null}

      {(!sectionGroups || sectionGroups.length === 0) && isConfigurable ? (
        <div className={classnames("btn-box btn-group")}>
          <div className="element-add" onClick={onGroupCreate}>
            <div className="element-add_icon">
              <Plus color="white" size={23} />
            </div>
            <div className="element-add_description">Add new group</div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Groups;
