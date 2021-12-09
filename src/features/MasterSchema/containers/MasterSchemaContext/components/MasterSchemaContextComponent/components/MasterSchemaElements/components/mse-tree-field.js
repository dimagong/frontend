import React from "react";
import PropTypes from "prop-types";
import { FiberManualRecord } from "@material-ui/icons";

import { stopPropagation } from "utility/event-decorators";

import MSETreeNode from "./mse-tree-node";

const MSETreeField = ({ name, date, isSystem, onSelectChange, className, children }) => {
  return (
    <MSETreeNode
      className={className}
      name={name}
      date={date}
      isSystem={isSystem}
      onClick={stopPropagation(onSelectChange)}
      prepend={
        <div className="ms-elements__mark-icon d-flex justify-content-center align-items-center">
          <FiberManualRecord fontSize={"inherit"} />
        </div>
      }
    >
      {children}
    </MSETreeNode>
  );
};

MSETreeField.propTypes = {
  name: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  isSystem: PropTypes.bool.isRequired,
  onSelectChange: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default MSETreeField;
