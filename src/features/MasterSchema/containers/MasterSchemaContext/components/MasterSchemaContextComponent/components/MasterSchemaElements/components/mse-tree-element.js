import PropTypes from "prop-types";
import classNames from "classnames";
import React, { useMemo } from "react";

import MSETreeField from "./mse-tree-field";
import MSETreeGroup from "./mse-tree-group";

const MSETreeElement = ({ state, onPopupAction, onSelect: propOnSelect, children }) => {
  const { node, expandable, selectable } = state;
  const onSelect = () => propOnSelect(node.nodeId);
  const toggleExpandable = () => expandable.select(node.key);
  const selected = useMemo(() => selectable.includes(node.nodeId), [node, selectable]);
  const className = classNames("ms-elements__node--selectable", {
    "ms-elements__node--selected": selected,
  });

  return node.isContainable ? (
    <MSETreeGroup
      className={className}
      id={node.key}
      name={node.name}
      date={node.createdAt}
      system={node.isSystem}
      expanded={expandable.includes(node.key)}
      onExpandChange={toggleExpandable}
      onSelectChange={onSelect}
      onPopupAction={onPopupAction}
    >
      {children}
    </MSETreeGroup>
  ) : (
    <MSETreeField className={className} name={node.name} date={node.createdAt} system={node.isSystem} onSelectChange={onSelect}>
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
