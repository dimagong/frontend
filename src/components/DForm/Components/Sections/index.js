import React from 'react';

import {TabContent, TabPane} from 'reactstrap';

import Groups from '../Groups';

import './styles.scss'

const SectionsComponent = ({ data, selectedSection, onElementClick, onGroupCreate, onFieldCreate }) => {

  return (
    <TabContent activeTab={selectedSection} className={"sections-content"}>
      {Object.values(data.sections).map((section) => (
        <TabPane tabId={section.id} key={section.id}>
          {section.isNew ? (
            <div className="px-2 py-5 text-center">
              You will be able to manage this section after you submit its creation
            </div>
          ) : (
            <Groups
              data={data}
              sectionGroups={section.relatedGroups}
              onElementClick={onElementClick}
              onGroupCreate={onGroupCreate}
              onFieldCreate={onFieldCreate}
            />
          )}

        </TabPane>
      ))}

    </TabContent>
  )
};

export default SectionsComponent;
