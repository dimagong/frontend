import React from "react";
import PropTypes from "prop-types";

import ContextTemplate from "components/ContextTemplate";

export const ApplicationWrapper = ({ name, children }) => {
  return (
    <ContextTemplate contextTitle="Application" contextName={name}>
      {children}
    </ContextTemplate>
  );
};

ApplicationWrapper.propTypes = {
  name: PropTypes.string,
};
