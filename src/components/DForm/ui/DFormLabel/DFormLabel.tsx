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

export const DFormLabel: FC<Props> = ({ id, label, isSmall = false, className }) => {
  const classes = classnames("dform-label", { "dform-label--small": isSmall }, className);

  if (id === undefined) {
    return (
      <span className={classes}>
        <span>{label}</span>
      </span>
    );
  }

  return (
    <label className={classes} htmlFor={id}>
      <span>{label}</span>
    </label>
  );
};
