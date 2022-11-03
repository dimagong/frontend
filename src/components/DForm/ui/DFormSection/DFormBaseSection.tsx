import "./dform-base-section.scss";

import React from "react";
import type { FC, ReactNode } from "react";

import { NmpScreenReaderOnly } from "features/nmp-ui";

type Props = {
  sectionName: string;
  children?: ReactNode;
};

export const DFormBaseSection: FC<Props> = (props) => {
  const { sectionName = "", children } = props;

  return (
    <div className="dform-section">
      <NmpScreenReaderOnly tag="h2">{sectionName}</NmpScreenReaderOnly>

      <div className="dform-section__body">{children}</div>
    </div>
  );
};
