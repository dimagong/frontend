import React from "react";
import type { FC, ReactNode } from "react";

import { DFormSection } from "../DFormSection";
import { DFormDroppable } from "../DFormDroppable";
import { DformElementTypes, DformSectionId } from "../../data/models";

type Props = {
  sectionId: DformSectionId;
  sectionName: string;
  isDraggable?: boolean;
  children?: ReactNode;
};

export const DFormEditableSection: FC<Props> = (props) => {
  const { sectionId, sectionName, isDraggable, children } = props;

  return (
    <DFormDroppable droppableId={sectionId} droppableType={DformElementTypes.Group} isDraggable={isDraggable}>
      <DFormSection isThin sectionName={sectionName}>
        {children}
      </DFormSection>
    </DFormDroppable>
  );
};
