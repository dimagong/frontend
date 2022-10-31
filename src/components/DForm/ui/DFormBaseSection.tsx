import React from "react";
import type { FC } from "react";

import Groups from "../Components/Groups";
import { DFormSchema } from "../types/dformSchema";

export type DFromBaseProps = {
  schema: DFormSchema;
  isHidden: boolean;
  sectionId: string;
  isDisabled: boolean;
  relatedGroups: Array<string>;
  // have to be refactored the <Groups /> component
  selectedElement?: any;
  onFieldCreate?: (groupId: string) => void;
  onGroupCreate?: (sectionId: string) => void;
  onElementClick?: (el: any, type: "field" | "group" | "section") => void;
};

export const DFormBaseSection: FC<DFromBaseProps> = (props) => {
  const { schema, isHidden, sectionId, isDisabled, relatedGroups } = props;
  const { selectedElement, onFieldCreate, onGroupCreate: propOnGroupCreate, onElementClick } = props;

  const onGroupCreate = () => {
    if (propOnGroupCreate) {
      propOnGroupCreate(sectionId);
    }
  };

  if (isHidden) {
    return null;
  }

  return (
    <Groups
      data={schema}
      sectionId={sectionId}
      isDisabled={isDisabled}
      selectedElement={selectedElement}
      sectionGroups={relatedGroups}
      onGroupCreate={onGroupCreate}
      onFieldCreate={onFieldCreate}
      onElementClick={onElementClick}
    />
  );
};
