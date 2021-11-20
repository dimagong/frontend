import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const MSETreeNode = ({ name, prepend, append, className: propClassName, onClick, children }) => {
  const className = classNames('ms-elements__node', propClassName);

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/click-events-have-key-events
    <li className={className} onClick={onClick}>
      <div className="ms-elements__node-content d-flex align-items-center">
        {prepend}
        <div className="ms-elements__name">{name}</div>
        {append}
      </div>
      {children}
    </li>
  );
};

MSETreeNode.propTypes = {
  name: PropTypes.string.isRequired,
  prepend: PropTypes.node,
  append: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
};

export default MSETreeNode;
