import "./styles.scss";

import React from "react";

import { DFormElementTypes } from "components/DForm";

import Fields from "../Fields";
import { useDFormContext } from "../../DFormContext";

import { ButtonAddItem } from "../../ui/ButtonAddItem";

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
  } = props;

  const { isConfigurable } = useDFormContext();

  const onGroupSelect = (groupId) => {
    if (!onElementClick) return;

    const group = data.groups[groupId];

    onElementClick({ ...group, sectionId }, "group");
  };

  return (
    <div>
      {sectionGroups.map((groupId, idx) => {
        const group = data.groups[groupId];

        if (group.isHidden) {
          return null;
        }

        const isDisabled = propIsDisabled || Boolean(group.isDisabled);
        const isSelected = selectedElement?.elementType === DFormElementTypes.Group && selectedElement?.id === group.id;
        const isLastGroup = sectionGroups.length - 1 === idx;
        const creteFieldByGroupId = () => onFieldCreate(groupId);

        return (
          <div className="group" key={groupId}>
            <div
              className={`group-title editable ${isSelected ? "selected" : ""}`}
              onClick={() => onGroupSelect(groupId)}
            >
              <span className="text-bold-500">{data.groups[groupId].name}</span>
            </div>
            <div className="group-content row mr-0 ml-0">
              <Fields
                data={data}
                groupId={groupId}
                isDisabled={isDisabled}
                selectedElement={selectedElement}
                groupFields={group.relatedFields}
                onFieldCreate={onFieldCreate}
                onElementClick={onElementClick}
              />
            </div>
            {isConfigurable && isSelected ? (
              <div
                className={classnames("btn-box", {
                  "btn-box-selected": isSelected,
                })}
              >
                <ButtonAddItem className="element-add" onClick={creteFieldByGroupId} label={"Add new form element"} />
              </div>
            ) : null}
            {isConfigurable && !isSelected && isLastGroup ? (
              <div className={classnames("btn-box", { "btn-group": isLastGroup && !isSelected })}>
                <ButtonAddItem className="element-add" onClick={creteFieldByGroupId} label={"Add new form element"} />
                <ButtonAddItem className="element-add" onClick={onGroupCreate} label={"Add new group"} />
              </div>
            ) : null}
          </div>
        );
      })}

      {!sectionGroups || sectionGroups.length === 0 ? (
        <div className="px-2 py-5 text-center w-100">There are no groups in this section</div>
      ) : null}

      {(!sectionGroups || sectionGroups.length === 0) && isConfigurable ? (
        <div className="btn-box btn-box-single">
          <ButtonAddItem className="element-add" onClick={onGroupCreate} label={"Add new group"} />
        </div>
      ) : null}
    </div>
  );
};

export default Groups;
