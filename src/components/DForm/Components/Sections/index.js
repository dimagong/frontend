import "./styles.scss";

import React from "react";
import { TabContent, TabPane } from "reactstrap";

import Groups from "../Groups";
import { useDFormContext } from "../../DFormContext";

const SectionsComponent = (props) => {
  const {
    data,
    values,
    selectedSection,
    selectedElement,
    onElementClick,
    onGroupCreate,
    onFieldCreate,
    onFieldChange,
  } = props;

  const { isConfigurable } = useDFormContext();

  if (!data?.sections || Object.keys(data.sections).length === 0) {
    // TODO HANDLE TWO CASES, when there are no sections on edit and no sections on assigned dform \ on onboarding dform
    if (isConfigurable) {
      return (
        <div className="px-2 py-5 text-center w-100">
          There are no available sections <br />
          <br />
          create one by clicking "New Tab" button, to start editing your application
        </div>
      );
    } else {
      return <div className="px-2 py-5 text-center w-100">This application is empty</div>;
    }
  }

  return (
    <TabContent activeTab={selectedSection} className="sections-content">
      {data.sectionsOrder.map((sectionId) => {
        const section = data.sections[sectionId];

        // ToDo: handle the isNew, currently isNew always undefined
        if (section.isNew) {
          return (
            <div className="px-2 py-5 text-center">
              You will be able to manage this section after you submit its creation
            </div>
          );
        }

        return (
          <TabPane tabId={section.id} key={section.id}>
            <Groups
              data={data}
              values={values}
              sectionId={section.id}
              isDisabled={section.isDisabled}
              selectedElement={selectedElement}
              sectionGroups={section.relatedGroups}
              onElementClick={onElementClick}
              onGroupCreate={() => onGroupCreate(section.id)}
              onFieldCreate={onFieldCreate}
              onFieldChange={onFieldChange}
            />
          </TabPane>
        );
      })}
    </TabContent>
  );
};

export default SectionsComponent;
