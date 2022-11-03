import React from "react";
import type { FC } from "react";

import { DFormDroppableSection } from "./_DFormDroppableSection";
import { DFormBaseSection, DFromBaseProps } from "./_DFormBaseSection";

type Props = DFromBaseProps;

export const DFormEditableSection: FC<Props> = (props) => {
  const { schema, isHidden, sectionId, isDisabled, relatedGroups } = props;
  const { selectedElement, onFieldCreate, onGroupCreate: propOnGroupCreate, onElementClick } = props;

  const onGroupCreate = () => {
    if (propOnGroupCreate) {
      propOnGroupCreate(sectionId);
    }
  };

  return (
    <DFormDroppableSection droppableId={sectionId}>
      <DFormBaseSection
        schema={schema}
        isHidden={isHidden}
        sectionId={sectionId}
        isDisabled={isDisabled}
        relatedGroups={relatedGroups}
        selectedElement={selectedElement}
        onFieldCreate={onFieldCreate}
        onGroupCreate={onGroupCreate}
        onElementClick={onElementClick}
      />
    </DFormDroppableSection>
  );
};
