import "./styles.scss";

import React from "react";
import { Plus } from "react-feather";
import { Droppable } from "react-beautiful-dnd";

import { Collapse } from "antd";

import { ElementTypes } from "components/DForm";

import { useDFormContext } from "../../../DFormContext";

import classnames from "classnames";
import { DFormDraggableElement } from "../DFormDraggableElement";
import { DraggableDFormFields } from "../Fields/DraggableDFormFields";

export const DraggableDFormGroups = (props) => {
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
    <div className="w-100 group">
      {sectionGroups.map((groupId, index) => {
        const group = data.groups[groupId];

        if (group.isHidden) {
          return null;
        }

        const isDisabled = propIsDisabled || Boolean(group.isDisabled);
        const isSelected = selectedElement?.elementType === ElementTypes.Group && selectedElement?.id === group.id;
        const isLastGroup = sectionGroups.length - 1 === index;

        const Title = (
          <div
            className={`group-title editable ${isSelected ? "selected" : ""}`}
            onClick={() => onGroupSelect(groupId)}
          >
            <span className="text-bold-500">{data.groups[groupId].name}</span>
          </div>
        );

        return (
          <DFormDraggableElement
            key={groupId}
            draggableId={groupId}
            index={index}
            title={Title}
            classname="w-100"
            dragIconClasses="dform-dnd__drag-handle-icon dform-dnd__drag-handle-icon--group"
          >
            <Collapse ghost activeKey={!isCollapsed ? "1" : null} bordered={false} key={groupId}>
              <Collapse.Panel showArrow={false} key="1">
                <Droppable droppableId={groupId} type={ElementTypes.Field}>
                  {(provided) => (
                    <div className="group-content row mr-0 ml-0" {...provided.droppableProps} ref={provided.innerRef}>
                      <DraggableDFormFields
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
              </Collapse.Panel>
            </Collapse>
          </DFormDraggableElement>
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
