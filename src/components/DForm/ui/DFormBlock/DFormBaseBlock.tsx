import React from "react";
import type { FC, ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export const DFormBaseBlock: FC<Props> = (props) => {
  const { children } = props;

  return <div className="half-with-or-full-width">{children}</div>;
};
