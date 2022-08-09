import React from "react";

import { TabContent, TabPane } from "reactstrap";

import Groups from "../Groups";

import "./styles.scss";

const SectionsComponent = ({
  data,
  selectedSection,
  onElementClick,
  onGroupCreate,
  onFieldCreate,
  values,
  onFieldValueChange,
}) => {
  if (!data.sections || Object.keys(data.sections).length === 0) {
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
      {data.sectionsOrder.map((section) => (
        <TabPane tabId={data.sections[section].id} key={data.sections[section].id}>
          {data.sections[section].isNew ? (
            <div className="px-2 py-5 text-center">
              You will be able to manage this section after you submit its creation
            </div>
          ) : (
            <Groups
              onFieldValueChange={onFieldValueChange}
              values={values}
              sectionId={data.sections[section].id}
              data={data}
              sectionGroups={data.sections[section].relatedGroups}
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
