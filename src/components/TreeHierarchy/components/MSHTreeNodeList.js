import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const MSHTreeNodeList = ({ root, children }) => {
  const className = classNames("tree-hierarchy__list", { "tree-hierarchy__list--root": root });

  return <ul className={className}>{children}</ul>;
};

MSHTreeNodeList.propTypes = {
  root: PropTypes.bool.isRequired,
  children: PropTypes.node,
};

export default MSHTreeNodeList;
