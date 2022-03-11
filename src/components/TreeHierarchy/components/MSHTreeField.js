import _ from "lodash/fp";
import React from "react";
import PropTypes from "prop-types";
import { FiberManualRecord } from "@material-ui/icons";

import TypedValuePreview from "components/MasterSchemaValuePreviews/TypedValuePreview";

import MSHTreeNode from "./MSHTreeNode";

const normalizeCount = (count) => {
  // Do not show zero count
  count = count > 0 ? count : null;

  if (_.isNumber(count)) {
    return count > 9 ? "+9" : `${count}`;
  }

  return null;
};

const MSHTreeField = (props) => {
  const {
    name,
    index,
    files,
    value,
    date,
    selected,
    isLocked,
    applicationsCount,
    versionsCount,
    onSelect,
    className,
    children,
  } = props;

  const renderValue = () => {
    if (_.isBoolean(value)) {
      return <TypedValuePreview type="boolean" value={value} isVertical={false} />;
    }

    if (_.isNumber(value)) {
      return <TypedValuePreview type="number" value={value} isVertical={false} />;
    }

    if (_.isString(value)) {
      return <TypedValuePreview type="text" value={value} isVertical={false} />;
    }

    if (Array.isArray(value)) {
      return <TypedValuePreview type="array" value={value.join(", ")} isVertical={false} />;
    }

    if (value != null) {
      return <TypedValuePreview type="" value={value} isVertical={false} />;
    }

    if (files) {
      return <TypedValuePreview type="files" value={files} isVertical={false} />;
    }

    return <TypedValuePreview type={null} value={null} isVertical={false} />;
  };

  return (
    <MSHTreeNode
      className={className}
      index={index}
      name={<div className="tree-hierarchy__name-text w-25" title={name}>{name}</div>}
      date={date}
      selected={selected}
      isLocked={isLocked}
      versionsCount={normalizeCount(versionsCount)}
      applicationsCount={normalizeCount(applicationsCount)}
      onSelect={onSelect}
      prepend={
        <div className="tree-hierarchy__mark-icon d-flex justify-content-center align-items-center">
          <FiberManualRecord fontSize={"inherit"} />
        </div>
      }
      append={<div className="tree-hierarchy__value px-1">{renderValue()}</div>}
      children={children}
    />
  );
};

MSHTreeField.propTypes = {
  name: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,

  files: PropTypes.arrayOf(PropTypes.object),
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]),

  isLocked: PropTypes.bool.isRequired,
  applicationsCount: PropTypes.number,
  versionsCount: PropTypes.number,

  onSelect: PropTypes.func,
  selected: PropTypes.bool,

  className: PropTypes.string,
  children: PropTypes.node,
};

export default MSHTreeField;
