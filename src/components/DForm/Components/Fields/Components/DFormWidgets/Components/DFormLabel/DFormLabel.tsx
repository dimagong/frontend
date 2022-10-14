import "./styles.scss";

import classnames from "classnames";
import React, { FC, ReactNode, CSSProperties } from "react";

type Props = {
  id?: string;
  label?: ReactNode;
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
