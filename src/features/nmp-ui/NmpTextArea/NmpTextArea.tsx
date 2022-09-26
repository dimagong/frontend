import "./styles.scss";

import React from "react";
import { Input } from "antd";
import classnames from "classnames";
import type { TextAreaProps } from "antd/lib/input";

const { TextArea } = Input;

export const NmpTextArea: React.FC<TextAreaProps> = ({ showCount = true, className, ...props }) => {
  return <TextArea showCount={showCount} className={classnames("", className)} {...props} />;
};
