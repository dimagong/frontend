import React from "react";

import Fields from '../Fields';

import './styles.scss'

const Groups = ({data, sectionGroups, onElementClick}) => {

  return (
    <div>
      {sectionGroups.map((sectionGroup) => (

        <div className="group" key={sectionGroup}>
          <div className="group-title" onClick={(e) => onElementClick(e, data.groups[sectionGroup])}>
            <span className="text-bold-500">{sectionGroup}</span>
          </div>
          <div className="group-content row">
            <Fields data={data} groupFields={data.groups[sectionGroup].relatedFields} onElementClick={onElementClick} />
          </div>
        </div>

      ))}
    </div>
  )
};

export default Groups;
