import "./styles.scss";

import React from "react";
import type { FC } from "react";

import classnames from "classnames";

import { Badge } from "antd";
import type { BadgeProps } from "antd";

export type NmpBadgeProps = BadgeProps;

export const NmpBadge: FC<NmpBadgeProps> = ({ className, ...props }) => {
  return <Badge className={classnames("nmp-badge", className)} {...props} />;
};
