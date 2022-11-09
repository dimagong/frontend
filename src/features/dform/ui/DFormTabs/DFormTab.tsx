import React from "react";
import type { FC, ReactNode } from "react";

import { DFormSelectable } from "../DFormSelectable";

export type DFormTabProps = {
  tabId: string;
  tabIndex: number;
  isSelected?: boolean;
  onClick?: (tabId: string) => void;
  children?: ReactNode;
};

export const DFormTab: FC<DFormTabProps> = (props) => {
  const { tabId, tabIndex, isSelected, children, onClick } = props;

  const onTabClick = () => {
    if (onClick) {
      onClick(tabId);
    }
  };

  return (
    <DFormSelectable isLeft isSelected={isSelected} onClick={onTabClick} className="dform-tabs__tab">
      <span className="dform-tabs__tab-label">{children}</span>
      <span className="dform-tabs__tab-icon">{tabIndex}</span>
    </DFormSelectable>
  );
};
