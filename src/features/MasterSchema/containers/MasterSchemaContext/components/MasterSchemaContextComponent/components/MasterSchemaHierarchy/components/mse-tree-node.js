import React from "react";
import moment from "moment";
import { noop } from "lodash/fp";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Lock } from "@material-ui/icons";

import { stopPropagation } from "utility/event-decorators";

const MSETreeNode = (props) => {
  const { name, date, selected, isLocked, onSelect, prepend, append, className: propClassName, children } = props;
  const className = classNames("ms-elements__node", propClassName, { "ms-elements__node--selected": selected });

  return (
    <li className={className} onClick={stopPropagation(onSelect)}>
      <div className="ms-elements__node-content d-flex align-items-center">
        {prepend}
        <div className="ms-elements__name">{name}</div>
        {append}
        <div className="d-flex align-items-center ml-auto">
          {isLocked && (
            <div className="ms-elements__lock px-3">
              <Lock fontSize="inherit" />
            </div>
          )}

          <div className="ms-elements__date">
            <div>{moment(date).format("DD.MM.YYYY")}</div>
            <div>{moment(date).format("HH:MM")}</div>
          </div>
        </div>
      </div>
      {children}
    </li>
  );
};

MSETreeNode.defaultProps = {
  onSelect: noop,
  selected: false,
};

MSETreeNode.propTypes = {
  name: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  isLocked: PropTypes.bool.isRequired,

  selected: PropTypes.bool,
  onSelect: PropTypes.func,

  prepend: PropTypes.node,
  append: PropTypes.node,

  className: PropTypes.string,
  children: PropTypes.node,
};

export default MSETreeNode;
