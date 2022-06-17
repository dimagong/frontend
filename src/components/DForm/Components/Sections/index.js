import React from "react";

import { TabContent, TabPane } from "reactstrap";

import Groups from "../Groups";

import "./styles.scss";

const SectionsComponent = ({ data, selectedSection, onElementClick, onGroupCreate, onFieldCreate }) => {
  if (Object.values(data.sections).length === 0) {
    // TODO HANDLE TWO CASES, when there are no sections on edit and no sections on assigned dform \ on onboarding dform
    return (
      <div className="px-2 py-5 text-center w-100">
        There are no available sections <br />
        <br />
        create one by clicking "New Tab" button, to start editing your application
      </div>
    );
  }

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
              sectionId={section.id}
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
  );
};

export default SectionsComponent;
