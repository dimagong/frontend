import "./dform-base-group.scss";

import React from "react";
import type { FC, ReactNode } from "react";

import { NmpRow } from "features/nmp-ui";

type Props = {
  groupName?: string;
  children?: ReactNode;
};

export const DFormBaseGroup: FC<Props> = (props) => {
  const { groupName = "", children } = props;

  return (
    <div className="dform-group">
      {groupName === "" ? null : <h3 className="dform-group__title">{groupName}</h3>}

      {children ? (
        <NmpRow gutter={40} className="dform-group__content">
          {children}
        </NmpRow>
      ) : null}
    </div>
  );
};
