import "./styles.scss";

import React from "react";
import classnames from "classnames";
import { Input, InputProps } from "antd";

export const NmpInput: React.FC<InputProps> = ({ className, ...props }) => {
  return <Input className={classnames("nmp-input", className)} {...props} />;
};
