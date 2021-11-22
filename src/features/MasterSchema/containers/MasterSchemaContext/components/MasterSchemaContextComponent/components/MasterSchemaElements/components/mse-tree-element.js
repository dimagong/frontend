import PropTypes from "prop-types";
import classNames from "classnames";
import React, { useMemo } from "react";

import MSETreeField from "./mse-tree-field";
import MSETreeCategory from "./mse-tree-category";

const MSETreeElement = ({ state, onPopupAction, children }) => {
  const { node, expandable, selectable } = state;
  const toggleExpandable = () => expandable.toggle([node.key]);
  const toggleSelectable = () => selectable.toggle([node.key]);
  const selected = useMemo(() => selectable.includes(node.key), [node.key, selectable]);
  const className = classNames("ms-elements__node--selectable", {
    "ms-elements__node--selected": selected,
  });

  return node.group ? (
    <MSETreeCategory
      className={className}
      id={node.id}
      name={node.name}
      expanded={expandable.includes(node.key)}
      onExpandChange={toggleExpandable}
      onSelectChange={toggleSelectable}
      onPopupAction={onPopupAction}
    >
      {children}
    </MSETreeCategory>
  ) : (
    <MSETreeField className={className} name={node.name} onSelectChange={toggleSelectable}>
      {children}
    </MSETreeField>
  );
};

MSETreeElement.propTypes = {
  state: PropTypes.object.isRequired,
  onToggleExpandable: PropTypes.func,
  onToggleSelectable: PropTypes.func,
  children: PropTypes.node,
};

export default MSETreeElement;
