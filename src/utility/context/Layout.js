import React from "react";

import FullLayout from "layouts/FullpageLayout";
import VerticalLayout from "layouts/VerticalLayout";

export const Layout = (props) => {
  const { type, children } = props;
  const LayoutComponent = type === "full" ? FullLayout : type === "vertical" ? VerticalLayout : React.Fragment;

  return <LayoutComponent>{children}</LayoutComponent>;
};
