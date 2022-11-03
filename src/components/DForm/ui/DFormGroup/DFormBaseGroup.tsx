import "./dform-base-group.scss";

import React from "react";
import type { FC, ReactNode } from "react";

import { NmpRow } from "features/nmp-ui";

type Props = {
  groupName?: string;
  renderTitle?: (node: ReactNode) => ReactNode;
  children?: ReactNode;
};

export const DFormBaseGroup: FC<Props> = (props) => {
  const { groupName = "", renderTitle, children } = props;

  const ownTitle = <h3 className="dform-group__title">{groupName}</h3>;
  const Title = renderTitle ? renderTitle(ownTitle) : ownTitle;

  return (
    <div className="dform-group">
      <div className="dform-group__head">{Title}</div>

      {children ? (
        <NmpRow gutter={40} className="dform-group__content">
          {children}
        </NmpRow>
      ) : null}
    </div>
  );
};
