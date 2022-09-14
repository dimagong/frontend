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

  const handleGroupSelect = (sectionGroup) => {
    onElementClick({ ...data.groups[sectionGroup], sectionId }, "group");
  };

  return (
    <div>
      {sectionGroups.map((sectionGroup) => {
        const group = data.groups[sectionGroup];

        if (group.isHidden) {
          return null;
        }

        const isDisabled = propIsDisabled || Boolean(group.isDisabled);
        const isSelected = selectedElement?.elementType === ElementTypes.Group && selectedElement?.id === group.id;

        return (
          <div className="group" key={sectionGroup}>
            <div
              className={`group-title editable ${isSelected ? "selected" : ""}`}
              onClick={() => handleGroupSelect(sectionGroup)}
            >
              <span className="text-bold-500">{data.groups[sectionGroup].name}</span>
            </div>
            <div className="group-content row mr-0 ml-0">
              <Fields
                data={data}
                values={values}
                group={sectionGroup}
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
