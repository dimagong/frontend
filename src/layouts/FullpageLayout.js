import "./full-page-layout.scss";

import React from "react";

const FullPageLayout = ({ children }) => {
  return (
    <div className="wrapper full-layout">
      <main className="full-layout__content">{children}</main>
    </div>
  );
};

export default FullPageLayout;
