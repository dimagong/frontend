import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import classNames from "classnames";

const MSETreeNode = ({ name, date, prepend, append, className: propClassName, onClick, children }) => {
  const className = classNames("ms-elements__node", propClassName);

  return (
    <li className={className} onClick={onClick}>
      <div className="ms-elements__node-content d-flex align-items-center">
        {prepend}
        <div className="ms-elements__name">{name}</div>
        {append}
        <div className="ms-elements__date ml-auto">
          <div>{moment(date).format("DD.MM.YYYY")}</div>
          <div>{moment(date).format("HH.MM")}</div>
        </div>
      </div>
      {children}
    </li>
  );
};

MSETreeNode.propTypes = {
  name: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  prepend: PropTypes.node,
  append: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
};

export default MSETreeNode;
