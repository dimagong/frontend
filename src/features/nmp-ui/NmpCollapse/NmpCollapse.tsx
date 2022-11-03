import React from "react";
import type { FC } from "react";
import { Collapse, CollapseProps } from "antd";

import { NmpCollapsePanel } from "./NmpCollapsePanel";

type Props = CollapseProps;

type _FC = FC<Props> & { Panel: typeof NmpCollapsePanel };

export const NmpCollapse: _FC = (props) => {
  return <Collapse {...props} />;
};

NmpCollapse.Panel = NmpCollapsePanel;
