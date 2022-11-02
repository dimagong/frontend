import "./styles.scss";

import React from "react";
import classnames from "classnames";
import type { FC, ReactNode, CSSProperties } from "react";

import { DFormLabel } from "../DFormLabel";

type Props = {
  label?: string;
  isRequired: boolean;
  isLabelShowing: boolean;
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
};

export const DFormLabeledItem: FC<Props> = (props) => {
  const { label = "", isRequired, isLabelShowing, style, className, children } = props;

  return (
    <div className={className} style={style}>
      <div className={classnames("dform-labeled-item__label", { "dform-labeled-item__label--required": isRequired })}>
        {isLabelShowing ? <DFormLabel label={label} /> : null}
      </div>

      <div className="dform-labeled-item__control">{children}</div>
    </div>
  );
};
