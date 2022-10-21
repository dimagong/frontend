import "./styles.scss";

import React, { FC } from "react";
import classnames from "classnames";
import { Button, ButtonProps } from "antd";

export type NmpButtonProps = Omit<ButtonProps, "type" | "shape"> & {
  iconRight?: boolean;
  type?: ButtonProps["type"] | "nmp-default" | "nmp-ghost" | "nmp-primary";
  shape?: ButtonProps["shape"] | "nmp-ellipse";
};

export const NmpButton: FC<NmpButtonProps> = (props) => {
  const { type = "nmp-default", shape, iconRight = false, className, ...rest } = props;

  const classes = classnames(className, "ant-btn-nmp", {
    "ant-btn-icon-nmp-right": iconRight,
  });

  return (
    <Button type={type as ButtonProps["type"]} shape={shape as ButtonProps["shape"]} className={classes} {...rest} />
  );
};
