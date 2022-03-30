import React from "react";
import PropTypes from "prop-types";

import GeneralMSHTreeField from "./GeneralMSHTreeField";
import GeneralMSHTreeGroup from "./GeneralMSHTreeGroup";

const GeneralMSHTreeElement = (props) => {
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
    children,
  } = props;

  return node.isContainable ? (
    <GeneralMSHTreeGroup
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
      children={children}
    />
  ) : (
    <GeneralMSHTreeField
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

GeneralMSHTreeElement.propTypes = {
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

export default GeneralMSHTreeElement;
