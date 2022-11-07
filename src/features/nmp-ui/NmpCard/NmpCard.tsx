import "./styles.scss";

import React from "react";
import type { FC } from "react";
import classnames from "classnames";
import { Card, CardProps } from "antd";

export type NmpCardProps = CardProps;

export const NmpCard: FC<NmpCardProps> = (props) => {
  const { className, children, ...cardProps } = props;

  const classes = classnames("nmp-card", className);
  return (
    <Card {...cardProps} className={classes}>
      {children}
    </Card>
  );
};
