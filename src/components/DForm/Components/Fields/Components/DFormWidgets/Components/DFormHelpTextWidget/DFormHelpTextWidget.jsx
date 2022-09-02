import React from "react";
import PropTypes from "prop-types";

export const DFormHelpTextWidget = ({ value }) => {
  return <div dangerouslySetInnerHTML={{ __html: value }} />;
};

DFormHelpTextWidget.propTypes = {
  value: PropTypes.string.isRequired,
};
