import "./styles.scss";

import React, { FC } from "react";
import { Button, ButtonProps } from "antd";

const NpmButton: FC<ButtonProps> = ({ children, ...props }) => {
  return <Button {...props}>{children}</Button>;
};

export default NpmButton;
