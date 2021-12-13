import PropTypes from "prop-types";
import classNames from "classnames";
import React, { useMemo } from "react";

import MSETreeField from "./mse-tree-field";
import MSETreeGroup from "./mse-tree-group";

const MSETreeElement = ({ state, onPopupAction, onSelect: propOnSelect, children }) => {
  const { node, expandable, selectable, collapseWhole } = state;
  const selected = useMemo(() => selectable.includes(node.nodeId), [node, selectable]);
  const expanded = useMemo(() => expandable.includes(node.nodeId), [node, expandable]);

  const onSelect = () => propOnSelect(node.nodeId);
  const toggleExpandable = () => {
    expandable.includes(node.nodeId) ? collapseWhole(node.nodeId) : expandable.expand(node.nodeId);
  };

  const className = classNames("ms-elements__node--selectable", {
    "ms-elements__node--selected": selected,
  });

  return node.isContainable ? (
    <MSETreeGroup
      className={className}
      id={node.key}
      name={node.name}
      date={node.createdAt}
      isSystem={node.isSystem}
      expanded={expanded}
      onExpandChange={toggleExpandable}
      onSelectChange={onSelect}
      onPopupAction={onPopupAction}
    >
      {children}
    </MSETreeGroup>
  ) : (
    <MSETreeField className={className} name={node.name} date={node.createdAt} isSystem={node.isSystem} onSelectChange={onSelect}>
      {children}
    </MSETreeField>
  );
};

MSETreeElement.propTypes = {
  state: PropTypes.object.isRequired,
  onSelect: PropTypes.func,
  onPopupAction: PropTypes.func,
  children: PropTypes.node,
};

export default MSETreeElement;
