import React from "react";
import PropTypes from "prop-types";
import { FiberManualRecord } from "@material-ui/icons";

import MSETreeNode from "./mse-tree-node";

const MSETreeField = ({ name, date, selected, isLocked, onSelect, className, children }) => {
  return (
    <MSETreeNode
      className={className}
      name={name}
      date={date}
      selected={selected}
      isLocked={isLocked}
      onSelect={onSelect}
      prepend={
        <div className="ms-elements__mark-icon d-flex justify-content-center align-items-center">
          <FiberManualRecord fontSize={"inherit"} />
        </div>
      }
      children={children}
    />
  );
};

MSETreeField.propTypes = {
  name: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  isLocked: PropTypes.bool.isRequired,

  onSelect: PropTypes.func,
  selected: PropTypes.bool,

  className: PropTypes.string,
  children: PropTypes.node,
};

export default MSETreeField;
