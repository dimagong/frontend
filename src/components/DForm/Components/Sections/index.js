import React from 'react';

import {TabContent, TabPane} from 'reactstrap';

import Groups from '../Groups';

import './styles.scss'

const SectionsComponent = ({ data, selectedSection, onElementClick }) => {

  return (
    <TabContent activeTab={selectedSection} className={"sections-content"}>
      {Object.values(data.sections).map((section) => (
        <TabPane tabId={section.name} key={section.name}>
          <Groups data={data} sectionGroups={section.relatedGroups} onElementClick={onElementClick} />
        </TabPane>
      ))}

    </TabContent>
  )
};

export default SectionsComponent;
