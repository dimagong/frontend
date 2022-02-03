import React from "react";
import PropTypes from "prop-types";

import MSHTreeField from "./MSHTreeField";
import MSHTreeGroup from "./MSHTreeGroup";

const MSHTreeElement = (props) => {
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
    <MSHTreeGroup
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
    <MSHTreeField
      name={node.name}
      date={node.createdAt}
      value={node.userValue || node.memberFirmValue}
      files={node.userFiles}
      applicationsCount={node.userDFormsCount}
      versionsCount={node.userMasterSchemaFieldVersionsCount}
      isLocked={node.isSystem}
      selected={selected}
      onSelect={onSelect}
      children={children}
    />
  );
};

MSHTreeElement.propTypes = {
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

export default MSHTreeElement;
