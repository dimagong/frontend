import { useContext } from 'react';
import PropTypes from 'prop-types';

import { TreeContext } from './tree-context';

const TreeNodeList = ({ root, children }) => {
  const treeContext = useContext(TreeContext);

  return treeContext.renderNodeList({ root, children });
};

TreeNodeList.propTypes = {
  root: PropTypes.bool.isRequired,
  children: PropTypes.node,
};

export default TreeNodeList;
