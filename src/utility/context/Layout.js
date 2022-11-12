import React from "react";

import FullLayout from "layouts/FullpageLayout";
import VerticalLayout from "layouts/VerticalLayout";

export const Layout = () => {
  const { type, children } = this.props;
  const LayoutComponent = type === "full" ? FullLayout : type === "vertical" ? VerticalLayout : React.Fragment;

  return <LayoutComponent>{children}</LayoutComponent>;
};
