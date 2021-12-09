import PropTypes from 'prop-types';
import React, { useContext } from 'react';

import TreeNode from './tree-node';
import TreeNodeList from './tree-node-list';
import { TreeContext } from './tree-context';

const TreeRenderer = ({ root, nodes }) => {
  const treeContext = useContext(TreeContext);

  return (
    <TreeNodeList root={root}>
      {nodes.map((node) => {
        const key = treeContext.getKey(node);
        const children = treeContext.getChildren(node);

        return (
          <TreeNode node={node} key={key}>
            {children.length > 0 && <TreeRenderer root={false} nodes={children} />}
          </TreeNode>
        );
      })}
    </TreeNodeList>
  );
};

TreeRenderer.propTypes = {
  root: PropTypes.bool.isRequired,
  nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TreeRenderer;
