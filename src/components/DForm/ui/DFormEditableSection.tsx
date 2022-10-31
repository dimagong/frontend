import React from "react";
import type { FC } from "react";

import { DFormDroppableSection } from "./DFormDroppableSection";
import { DFormBaseSection, DFromBaseProps } from "./DFormBaseSection";

type Props = DFromBaseProps;

export const DFormEditableSection: FC<Props> = (props) => {
  const { schema, isHidden, sectionId, isDisabled, relatedGroups } = props;
  const { selectedElement, onFieldCreate, onGroupCreate, onElementClick } = props;

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
