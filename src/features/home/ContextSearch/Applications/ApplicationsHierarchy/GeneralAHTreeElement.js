import React from "react";
import PropTypes from "prop-types";

import { GeneralAHField } from "./GeneralAHField";
import { GeneralAHGroup } from "./GeneralAHGroup";

export const GeneralAHTreeElement = (props) => {
  const {
    node,
    index,
    selected,
    onSelect,
    expanded,
    onExpand,
    onCollapse,
    onFieldCreatorClick,
    onGroupCreatorClick,
    onGroupDelete,
    onGroupEdit,
    children,
  } = props;

  return node.isContainable ? (
    <GeneralAHGroup
      node={node}
      index={index}
      name={node.name}
      date={node.createdAt}
      isLocked={node.isSystem || false}
      expanded={expanded}
      onExpand={onExpand}
      onCollapse={onCollapse}
      selected={selected}
      onSelect={onSelect}
      onFieldCreatorClick={onFieldCreatorClick}
      onGroupCreatorClick={onGroupCreatorClick}
      onGroupDelete={onGroupDelete}
      onGroupEdit={onGroupEdit}
      children={children}
    />
  ) : (
    <GeneralAHField
      name={node.name}
      index={index}
      date={node.createdAt}
      isLocked={node.isSystem || false}
      selected={selected}
      onSelect={onSelect}
      children={children}
    />
  );
};

GeneralAHTreeElement.propTypes = {
  node: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,

  selected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func,

  expanded: PropTypes.bool.isRequired,
  onExpand: PropTypes.func,
  onCollapse: PropTypes.func,

  onFieldCreatorClick: PropTypes.func,
  onGroupCreatorClick: PropTypes.func,

  children: PropTypes.node,
};
