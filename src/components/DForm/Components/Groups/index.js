import React from "react";

import { Plus } from "react-feather";

import Fields from "../Fields";

import "./styles.scss";

const Groups = ({
  data,
  sectionGroups,
  onElementClick,
  onGroupCreate,
  onFieldEvent,
  sectionId,
  values,
  isConfigurable,
}) => {
  const handleGroupSelect = (sectionGroup) => {
    onElementClick({ ...data.groups[sectionGroup], sectionId }, "group");
  };

  return (
    <div>
      {sectionGroups.map((sectionGroup) => (
        <div className="group" key={sectionGroup}>
          <div className="group-title editable" onClick={() => handleGroupSelect(sectionGroup)}>
            <span className="text-bold-500">{data.groups[sectionGroup].name}</span>
          </div>
          <div className="group-content row mr-0 ml-0">
            <Fields
              values={values}
              group={sectionGroup}
              data={data}
              groupFields={data.groups[sectionGroup].relatedFields}
              onElementClick={onElementClick}
              onFieldEvent={onFieldEvent}
              isConfigurable={isConfigurable}
            />
          </div>
        </div>
      ))}
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
