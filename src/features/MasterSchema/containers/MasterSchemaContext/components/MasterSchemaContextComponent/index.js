import React from 'react';
import PropTypes from 'prop-types';

import ContextTemplate from 'components/ContextTemplate';

const MasterSchemaContextComponent = ({ children }) => {
  return (
    <ContextTemplate contextTitle="Master Schema" contextName="Organization view">
      {children}
    </ContextTemplate>
  );
};

MasterSchemaContextComponent.propTypes = {
  children: PropTypes.node
};

export default MasterSchemaContextComponent;
