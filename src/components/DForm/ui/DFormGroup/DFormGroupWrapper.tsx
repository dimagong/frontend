import "./dform-group-wrapper.scss";

import React from "react";
import type { FC, ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export const DFormGroupWrapper: FC<Props> = (props) => {
  const { children } = props;

  return <div className="dform-group-wrapper">{children}</div>;
};
