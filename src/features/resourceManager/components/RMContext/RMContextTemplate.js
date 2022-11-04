import React from "react";

import ContextTemplate from "components/ContextTemplate";

const RMContextTemplate = ({ children }) => {
  return <ContextTemplate contextTitle="Resource Manager">{children}</ContextTemplate>;
};

export default RMContextTemplate;
