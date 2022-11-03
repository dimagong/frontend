import React from "react";
import type { FC } from "react";

import { DFormElementTypes } from "../../types";
import { DFormDroppable } from "../DFormDroppable";
import { DFormBaseSection } from "./DFormBaseSection";

type Props = {
  sectionId: string;
  sectionName: string;
  isDraggable?: boolean;
};

export const DFormEditableSection: FC<Props> = (props) => {
  const { sectionId, sectionName, isDraggable, children } = props;

  return (
    <DFormDroppable droppableId={sectionId} droppableType={DFormElementTypes.Group} isDraggable={isDraggable}>
      <DFormBaseSection sectionName={sectionName}>{children}</DFormBaseSection>
    </DFormDroppable>
  );
};
