import React from "react";
import PropTypes from "prop-types";
import { FiberManualRecord } from "@material-ui/icons";

import MSHTreeNode from "./MSHTreeNode";

const MSHTreeField = (props) => {
  const { name, date, selected, isLocked, applicationsCount, versionsCount, onSelect, className, children } = props;

  return (
    <MSHTreeNode
      className={className}
      name={name}
      date={date}
      selected={selected}
      isLocked={isLocked}
      applicationsCount={applicationsCount}
      versionsCount={versionsCount}
      onSelect={onSelect}
      prepend={
        <div className="tree-hierarchy__mark-icon d-flex justify-content-center align-items-center">
          <FiberManualRecord fontSize={"inherit"} />
        </div>
      }
      children={children}
    />
  );
};

MSHTreeField.propTypes = {
  name: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,

  isLocked: PropTypes.bool.isRequired,
  applicationsCount: PropTypes.number,
  versionsCount: PropTypes.number,

  onSelect: PropTypes.func,
  selected: PropTypes.bool,

  className: PropTypes.string,
  children: PropTypes.node,
};

export default MSHTreeField;
