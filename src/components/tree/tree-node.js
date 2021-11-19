import PropTypes from 'prop-types';
import { useContext } from 'react';

import { TreeContext } from './tree-context';

const TreeNode = ({ node, children }) => {
  const treeContext = useContext(TreeContext);

  return treeContext.renderNode({ node, children });
};

TreeNode.propTypes = {
  node: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export default TreeNode;
