import "./styles.scss";

import React from "react";
import { Plus } from "react-feather";

import { ElementTypes } from "components/DForm";

import Fields from "../Fields";
import { useDFormContext } from "../../DFormContext";

const Groups = (props) => {
  const {
    data,
    values,
    sectionId,
    isDisabled: propIsDisabled,
    sectionGroups,
    selectedElement,
    onElementClick,
    onGroupCreate,
    onFieldCreate,
    onFieldChange,
  } = props;

  const { isConfigurable } = useDFormContext();

  const onGroupSelect = (groupId) => {
    if (!onElementClick) return;

    const group = data.groups[groupId];

    onElementClick({ ...group, sectionId }, "group");
  };

  return (
    <div>
      {sectionGroups.map((groupId) => {
        const group = data.groups[groupId];

        if (group.isHidden) {
          return null;
        }

        const isDisabled = propIsDisabled || Boolean(group.isDisabled);
        const isSelected = selectedElement?.elementType === ElementTypes.Group && selectedElement?.id === group.id;

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
                values={values}
                groupId={groupId}
                isDisabled={isDisabled}
                selectedElement={selectedElement}
                groupFields={group.relatedFields}
                onFieldChange={onFieldChange}
                onFieldCreate={onFieldCreate}
                onElementClick={onElementClick}
              />
            </div>
          </div>
        );
      })}

      {!sectionGroups ||
        (!sectionGroups.length && (
          <div className="px-2 py-5 text-center w-100">There are no groups in this section</div>
        ))}

      {isConfigurable ? (
        <div className="group">
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
