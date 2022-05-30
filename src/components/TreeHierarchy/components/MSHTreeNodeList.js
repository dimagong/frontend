import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const MSHTreeNodeList = ({ root, index, children }) => {
  const className = classNames("tree-hierarchy__list position-relative", { "tree-hierarchy__list--root": root });

  return (
    <ul className={className} style={{ zIndex: index }}>
      {children}
    </ul>
  );
};

MSHTreeNodeList.propTypes = {
  root: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  children: PropTypes.node,
};

export default MSHTreeNodeList;
