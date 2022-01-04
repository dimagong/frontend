import React from "react";
import PropTypes from "prop-types";

import MSETreeField from "./mse-tree-field";
import MSETreeGroup from "./mse-tree-group";

const MSETreeElement = (props) => {
  const {
    node,
    selected,
    onSelect,
    expanded,
    onExpand,
    onCollapse,
    onFieldCreatorClick,
    onGroupCreatorClick,
    children,
  } = props;

  return node.isContainable ? (
    <MSETreeGroup
      name={node.name}
      date={node.createdAt}
      isLocked={node.isSystem}
      expanded={expanded}
      onExpand={onExpand}
      onCollapse={onCollapse}
      selected={selected}
      onSelect={onSelect}
      onFieldCreatorClick={onFieldCreatorClick}
      onGroupCreatorClick={onGroupCreatorClick}
      children={children}
    />
  ) : (
    <MSETreeField
      name={node.name}
      date={node.createdAt}
      isLocked={node.isSystem}
      selected={selected}
      onSelect={onSelect}
      children={children}
    />
  );
};

MSETreeElement.propTypes = {
  node: PropTypes.object.isRequired,

  selected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func,

  expanded: PropTypes.bool.isRequired,
  onExpand: PropTypes.func,
  onCollapse: PropTypes.func,

  onFieldCreatorClick: PropTypes.func,
  onGroupCreatorClick: PropTypes.func,

  children: PropTypes.node,
};

export default MSETreeElement;
