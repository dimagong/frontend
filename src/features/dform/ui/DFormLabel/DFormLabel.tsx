import "./styles.scss";

import React from "react";
import classnames from "classnames";
import type { FC, CSSProperties } from "react";

type Props = {
  id?: string;
  label?: string;
  isSmall?: boolean;
  className?: string;
  style?: CSSProperties;
};

export const DFormLabel: FC<Props> = ({ id, label, isSmall = false, style, className }) => {
  const classes = classnames("dform-label", { "dform-label--small": isSmall }, className);

  return (
    <span style={style} className={classes}>
      {id === undefined ? <span>{label}</span> : <label htmlFor={id}>{label}</label>}
    </span>
  );
};
