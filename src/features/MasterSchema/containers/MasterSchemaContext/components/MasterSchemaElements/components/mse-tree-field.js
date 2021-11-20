import React from 'react';
import PropTypes from 'prop-types';
import { FiberManualRecord } from '@material-ui/icons';

import MSETreeNode from './mse-tree-node';

const MSETreeField = ({ name, onSelectChange, className, children }) => {
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
  onSelectChange: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default MSETreeField;
