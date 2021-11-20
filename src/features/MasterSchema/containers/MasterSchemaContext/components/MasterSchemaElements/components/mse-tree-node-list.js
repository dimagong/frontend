import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const MSETreeNodeList = ({ root, children }) => {
  const className = classNames('ms-elements__list', { 'ms-elements__list--root': root });

  return <ul className={className}>{children}</ul>;
};

MSETreeNodeList.propTypes = {
  root: PropTypes.bool.isRequired,
  children: PropTypes.node,
};

export default MSETreeNodeList;
