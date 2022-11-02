import "./styles.scss";

import React from "react";
import classnames from "classnames";
import type { FC, ReactNode, CSSProperties } from "react";

import { DFormLabel } from "../DFormLabel";

type Props = {
  id?: string;
  label?: string;
  isRequired: boolean;
  isLabelShowing: boolean;
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
};

export const DFormLabeledItem: FC<Props> = (props) => {
  const { id, label = "", isRequired, isLabelShowing, style, className, children } = props;

  return (
    <div className={classnames("dform-labeled-item", className)} style={style}>
      {label === "" || !isLabelShowing ? null : (
        <div className={classnames("dform-labeled-item__label", { "dform-labeled-item__label--required": isRequired })}>
          <DFormLabel id={id} label={label} />
        </div>
      )}

      <div className="dform-labeled-item__control">
        <div className="dform-labeled-item__control-content">{children}</div>
      </div>
    </div>
  );
};
