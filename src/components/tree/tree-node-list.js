import { useContext } from "react";
import PropTypes from "prop-types";

import { TreeContext } from "./tree-context";

const TreeNodeList = ({ root, index, children }) => {
  const treeContext = useContext(TreeContext);

  return treeContext.renderNodeList({ root, index, children });
};

TreeNodeList.propTypes = {
  root: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  children: PropTypes.node,
};

export default TreeNodeList;
