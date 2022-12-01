import classnames from "classnames";
import React, { cloneElement } from "react";
import type { FC, ReactElement } from "react";

export type DFormMemberTabProps = {
  progress?: number;
  isViewed?: boolean;
  isActive?: boolean;
  isRequired?: boolean;
  children: ReactElement;
};

export const DFormMemberTab: FC<DFormMemberTabProps> = (props) => {
  const { progress = 0, isViewed = false, isActive = false, isRequired = false, children } = props;
  const isCompleted = progress === 100 && !isActive;

  return cloneElement(children, {
    className: classnames(children.props.className, "dform-member-tabs__tab", {
      "dform-member-tabs__tab--viewed": isViewed,
      "dform-member-tabs__tab--completed": isCompleted,
      "dform-member-tabs__tab--required": isRequired,
    }),
  });
};
