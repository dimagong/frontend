import React from 'react';
import PropTypes from 'prop-types';

import MSETreeField from './mse-tree-field';
import MSETreeCategory from './mse-tree-category';

const MSETreeElement = ({ state, onPopupAction, children }) => {
  const { node, expandable, selectable } = state;
  const toggleExpandable = () => expandable.toggle([node.id]);
  const toggleSelectable = () => selectable.toggle([node.id]);

  return node.category ? (
    <MSETreeCategory id={node.id} name={node.name} expanded={expandable.includes(node.id)} onExpandChange={toggleExpandable} onPopupAction={onPopupAction}>
      {children}
    </MSETreeCategory>
  ) : (
    <MSETreeField name={node.name} selected={selectable.includes(node.id)} onSelectChange={toggleSelectable}>
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
