import React from "react";
import type { FC } from "react";

import { DFormSection } from "../DFormSection";
import { DFormElementTypes } from "../../types";
import { DFormDroppable } from "../DFormDroppable";

type Props = {
  sectionId: string;
  sectionName: string;
  isDraggable?: boolean;
};

export const DFormEditableSection: FC<Props> = (props) => {
  const { sectionId, sectionName, isDraggable, children } = props;

  return (
    <DFormDroppable droppableId={sectionId} droppableType={DFormElementTypes.Group} isDraggable={isDraggable}>
      <DFormSection isThin sectionName={sectionName}>
        {children}
      </DFormSection>
    </DFormDroppable>
  );
};
