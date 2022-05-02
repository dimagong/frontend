import React from "react";
import PropTypes from "prop-types";

import TreeRenderer from "./tree-renderer";
import { TreeContext } from "./tree-context";

// :: <T>(node: T): string
const defaultGetKey = (node) => node.id ?? node.key;
// :: <T>(node: T): T[]
const defaultGetChildren = (node) => node.children || [];

const TreeRoot = ({ nodes, renderNode, renderNodeList, getKey = defaultGetKey, getChildren = defaultGetChildren }) => {
  const value = { renderNode, renderNodeList, getKey, getChildren };

  return (
    <TreeContext.Provider value={value}>
      <TreeRenderer root index={0} nodes={nodes} />
    </TreeContext.Provider>
  );
};

TreeRoot.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
  renderNode: PropTypes.elementType.isRequired,
  renderNodeList: PropTypes.elementType.isRequired,
  getKey: PropTypes.func,
  getChildren: PropTypes.func,
};

export default TreeRoot;
