import PropTypes from "prop-types";
import classNames from "classnames";
import React, { useMemo } from "react";

import MSETreeField from "./mse-tree-field";
import MSETreeCategory from "./mse-tree-category";

const MSETreeElement = ({ state, onPopupAction, children }) => {
  const { node, expandable, selectable } = state;
  const toggleExpandable = () => expandable.toggle([node.id]);
  const toggleSelectable = () => selectable.toggle([node.id]);
  const selected = useMemo(() => selectable.includes(node.id), [node.id, selectable]);
  const className = classNames("ms-elements__node--selectable", {
    "ms-elements__node--selected": selected,
  });

  return node.category ? (
    <MSETreeCategory
      className={className}
      id={node.id}
      name={node.name}
      expanded={expandable.includes(node.id)}
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
