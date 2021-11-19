import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FiberManualRecord } from '@material-ui/icons';

import MSETreeNode from './mse-tree-node';

const MSETreeField = ({ name, selected, onSelectChange, children }) => {
  const className = classNames('ms-elements__node--selectable', { 'ms-elements__node--selected': selected });

  return (
    <MSETreeNode
      className={className}
      name={name}
      onClick={onSelectChange}
      prepend={
        <div className="ms-elements__mark-icon d-flex justify-content-center align-items-center">
          <FiberManualRecord fontSize={'inherit'} />
        </div>
      }
    >
      {children}
    </MSETreeNode>
  );
};

MSETreeField.propTypes = {
  name: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  onSelectChange: PropTypes.func,
  children: PropTypes.node,
};

export default MSETreeField;
