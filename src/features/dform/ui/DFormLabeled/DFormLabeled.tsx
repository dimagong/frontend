import "./styles.scss";

import React from "react";
import classnames from "classnames";
import type { FC, ReactNode } from "react";

import { DFormLabel } from "../DFormLabel";

type Props = {
  id?: string;
  label?: string;
  isRequired?: boolean;
  isLabelShowing?: boolean;
  children: ReactNode;
};

export const DFormLabeled: FC<Props> = (props) => {
  const { id, label = "", isRequired = false, isLabelShowing = true, children } = props;
  const classes = classnames("dform-labeled", { "dform-labeled--required": isRequired });

  return (
    <div className={classes}>
      {label === "" || !isLabelShowing ? null : (
        <div className="dform-labeled__label">
          <DFormLabel id={id} label={label} />
        </div>
      )}

      <div className="dform-labeled__control">
        <div className="dform-labeled__control-content">{children}</div>
      </div>
    </div>
  );
};
