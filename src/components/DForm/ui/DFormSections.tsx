import React from "react";
import type { FC } from "react";
import { TabContent, TabPane } from "reactstrap";

import { DFormSection } from "./DFormSection";
import { useDFormContext } from "../DFormContext";
import { DFormSchema } from "../types/dformSchema";

type Props = {
  schema: DFormSchema;
  selectedElement?: any;
  selectedSectionId: string;
  onGroupCreate?: (sectionId: string) => void;
  onFieldCreate?: (groupId: string) => void;
  onElementClick?: (el: any, type: "field" | "group" | "section") => void;
};

export const DFormSections: FC<Props> = (props) => {
  const { schema, selectedSectionId, selectedElement, onElementClick, onGroupCreate, onFieldCreate } = props;

  const { isConfigurable } = useDFormContext();

  if (!schema.sections || Object.keys(schema.sections).length === 0) {
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
    <TabContent activeTab={selectedSectionId}>
      {schema.sectionsOrder.map((sectionId) => {
        if (selectedSectionId !== sectionId) {
          return null;
        }

        const { id, isHidden, isDisabled, relatedGroups } = schema.sections[sectionId];

        return (
          <TabPane tabId={id} key={id}>
            <DFormSection
              id={id}
              schema={schema}
              isHidden={isHidden}
              isDisabled={isDisabled}
              relatedGroups={relatedGroups}
              selectedElement={selectedElement}
              onFieldCreate={onFieldCreate}
              onGroupCreate={onGroupCreate}
              onElementClick={onElementClick}
            />
          </TabPane>
        );
      })}
    </TabContent>
  );
};
