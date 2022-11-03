import React from "react";
import type { FC } from "react";
import { Collapse, CollapsePanelProps } from "antd";

type Props = CollapsePanelProps;

export const NmpCollapsePanel: FC<Props> = (props) => {
  return <Collapse.Panel {...props} />;
};
