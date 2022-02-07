import PropTypes from 'prop-types';
import { useContext } from 'react';

import { TreeContext } from './tree-context';

const TreeNode = ({ index, node, children }) => {
  const treeContext = useContext(TreeContext);

  return treeContext.renderNode({ index, node, children });
};

TreeNode.propTypes = {
  index: PropTypes.number.isRequired,
  node: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export default TreeNode;
