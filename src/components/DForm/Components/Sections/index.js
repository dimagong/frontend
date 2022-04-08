import React from 'react';

import {TabContent, TabPane} from 'reactstrap';

import Groups from '../Groups';

import './styles.scss'

const SectionsComponent = ({ data, selectedSection, onElementClick, onGroupCreate, onFieldCreate }) => {

  return (
    <TabContent activeTab={selectedSection} className={"sections-content"}>
      {Object.values(data.sections).map((section) => (
        <TabPane tabId={section.name} key={section.name}>
          <Groups
            data={data}
            sectionGroups={section.relatedGroups}
            onElementClick={onElementClick}
            onGroupCreate={onGroupCreate}
            onFieldCreate={onFieldCreate}
          />
        </TabPane>
      ))}

    </TabContent>
  )
};

export default SectionsComponent;
