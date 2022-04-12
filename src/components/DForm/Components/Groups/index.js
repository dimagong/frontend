import React from "react";

import {Plus} from 'react-feather'

import Fields from '../Fields';

import './styles.scss'

const Groups = ({data, sectionGroups, onElementClick, onGroupCreate, onFieldCreate}) => {

  return (
    <div>
      {sectionGroups.map((sectionGroup) => (

        <div className="group" key={sectionGroup}>
          <div className="group-title editable" onClick={(e) => onElementClick(data.groups[sectionGroup], "group")}>
            <span className="text-bold-500">{data.groups[sectionGroup].name}</span>
          </div>
          <div className="group-content">
            <Fields group={sectionGroup} data={data} groupFields={data.groups[sectionGroup].relatedFields} onElementClick={onElementClick} onFieldCreate={onFieldCreate} />
          </div>
        </div>
      ))}
      {!!onGroupCreate && (
        <div className="group">
          <div className="element-add" onClick={onGroupCreate}>
            <div className="element-add_icon">
              <Plus color="white" size={23} />
            </div>
            <div className="element-add_description">
              Add new group
            </div>
          </div>
        </div>
      )}

    </div>
  )
};

export default Groups;
