import React from "react";

import Fields from '../Fields';

import './styles.scss'

const Groups = ({data, sectionGroups}) => {

  return (
    <div>
      {sectionGroups.map((sectionGroup) => (

        <div className="group" key={sectionGroup}>
          <div className="group-title">
            <span className="text-bold-500">{sectionGroup}</span>
          </div>
          <div className="group-content">
            <Fields data={data} groupFields={data.groups[sectionGroup].relatedFields} />
          </div>
        </div>

      ))}
    </div>
  )
};

export default Groups;
