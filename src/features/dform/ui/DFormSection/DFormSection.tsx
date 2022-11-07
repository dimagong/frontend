import "./styles.scss";

import React from "react";
import type { FC } from "react";
import classnames from "classnames";

import { NmpScreenReaderOnly } from "features/nmp-ui";

export type DFormSectionProps = {
  isThin?: boolean;
  sectionName: string;
};

export const DFormSection: FC<DFormSectionProps> = (props) => {
  const { isThin = false, sectionName = "", children } = props;
  const classes = classnames("dform-section", { "dform-section--thin": isThin });

  return (
    <div className={classes}>
      <NmpScreenReaderOnly tag="h2">{sectionName}</NmpScreenReaderOnly>

      <div className="dform-section__body">{children}</div>
    </div>
  );
};
