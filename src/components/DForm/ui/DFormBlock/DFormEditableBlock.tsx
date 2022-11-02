import React from "react";
import type { FC, ReactNode } from "react";

import { DFormDraggable } from "../DFormDraggable";

type Props = {
  children: ReactNode;
};

export const DFormEditableBlock: FC<Props> = (props) => {
  const { children } = props;

  return (
    <DFormDraggable index={0} draggableId={"id"}>
      {children}
    </DFormDraggable>
  );
};
