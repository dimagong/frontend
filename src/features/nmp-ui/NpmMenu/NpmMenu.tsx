import "./styles.scss";

import React from "react";
import classnames from "classnames";
import { Menu, MenuProps } from "antd";

type Props = MenuProps;

const NpmMenu: React.FC<Props> = ({ className, ...props }) => {
  return <Menu className={classnames("npm-menu", className)} {...props} />;
};

export default NpmMenu;
