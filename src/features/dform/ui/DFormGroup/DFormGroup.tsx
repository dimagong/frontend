import "./styles.scss";

import React from "react";
import classnames from "classnames";
import type { FC, ReactNode } from "react";

import { DFormSizingGroup } from "../DFormSizing";

type Props = {
  groupName?: string;
  renderTitle?: (node: ReactNode) => ReactNode;
  isEmptyTitleRendered?: boolean;
  children?: ReactNode;
};

export const DFormGroup: FC<Props> = (props) => {
  const { groupName = "", renderTitle, isEmptyTitleRendered = false, children } = props;

  const ownTitle = <h3 className="dform-group__title">{groupName}</h3>;
  const Title = renderTitle ? renderTitle(ownTitle) : ownTitle;
  const isGroupNameEmpty = groupName === "";

  const classes = classnames("dform-group", { "dform-group--no-title": isGroupNameEmpty });

  return (
    <div className={classes}>
      {!isEmptyTitleRendered && isGroupNameEmpty ? null : <div className="dform-group__head">{Title}</div>}

      {children ? (
        <div className="dform-group__content">
          <DFormSizingGroup>{children}</DFormSizingGroup>
        </div>
      ) : null}
    </div>
  );
};
