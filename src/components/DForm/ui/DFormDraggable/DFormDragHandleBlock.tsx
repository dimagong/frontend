import "./dform-drag-handle-block.scss";

import React from "react";
import type { FC, ReactNode } from "react";

type Props = {
  dragHandle?: ReactNode;
  children?: ReactNode;
};

export const DFormDragHandleBlock: FC<Props> = (props) => {
  const { dragHandle, children } = props;

  return (
    <div className="dform-drag-handle-block">
      {dragHandle}
      {children}
    </div>
  );
};
