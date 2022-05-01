import React from "react";
import PropTypes from "prop-types";
import { FiberManualRecord } from "@material-ui/icons";

import MSHTreeNode from "components/TreeHierarchy/components/MSHTreeNode";

const GeneralMSHTreeField = (props) => {
  const { name, date, index, selected, isLocked, onSelect, className, children } = props;

  return (
    <MSHTreeNode
      className={className}
      name={
        <div className="tree-hierarchy__name-text w-75" title={name}>
          {name}
        </div>
      }
      date={date}
      index={index}
      selected={selected}
      isLocked={isLocked}
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

GeneralMSHTreeField.propTypes = {
  name: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,

  isLocked: PropTypes.bool.isRequired,

  onSelect: PropTypes.func,
  selected: PropTypes.bool,

  className: PropTypes.string,
  children: PropTypes.node,
};

export default GeneralMSHTreeField;
