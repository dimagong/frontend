import PropTypes from "prop-types";
import React, { useContext } from "react";

import TreeNode from "./tree-node";
import TreeNodeList from "./tree-node-list";
import { TreeContext } from "./tree-context";

const TreeRenderer = ({ root, index, nodes }) => {
  const treeContext = useContext(TreeContext);

  return (
    <TreeNodeList root={root} index={index}>
      {nodes.map((node, index) => {
        const negativeIndex = nodes.length - index;
        const key = treeContext.getKey(node);
        const children = treeContext.getChildren(node);

        return (
          <TreeNode index={negativeIndex} node={node} key={key}>
            {children.length > 0 && <TreeRenderer root={false} index={negativeIndex} nodes={children} />}
          </TreeNode>
        );
      })}
    </TreeNodeList>
  );
};

TreeRenderer.propTypes = {
  root: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TreeRenderer;
