import React from "react";
import type { FC, ReactNode } from "react";

export type DFormSectionTabProps = {
  tabIndex: number;
  children?: ReactNode;
};

export const DFormSectionTab: FC<DFormSectionTabProps> = (props) => {
  const { tabIndex, children } = props;

  return (
    <span className="dform-section-tabs__tab">
      <span className="dform-section-tabs__tab-label">{children}</span>
      <span className="dform-section-tabs__tab-icon">{tabIndex}</span>
    </span>
  );
};
