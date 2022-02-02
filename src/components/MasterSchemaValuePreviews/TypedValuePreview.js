import _ from "lodash/fp";
import classNames from "classnames";
import { PropTypes } from "prop-types";
import React, { useMemo } from "react";

import ValuePreview from "./ValuePreview";
import FilesValuePreview from "./FilesValuePreview";

const TypedValuePreview = ({ type, value, isVertical }) => {
  const capitalizedType = useMemo(() => _.capitalize(type), [type]);
  const wrapperClassname = classNames("d-flex", isVertical ? "flex-column" : "flex-row");

  if (!value) {
    return type ? `${capitalizedType}: n.a` : "n.a";
  }

  if (type === "boolean") {
    const normalizedValue = value ? "Yes" : "No";

    return (
      <div className={wrapperClassname}>
        <div style={{ paddingRight: "0.5rem" }}>{`${capitalizedType}:`}</div>
        <ValuePreview value={normalizedValue} length={3} />
      </div>
    );
  }

  if (type === "files") {
    const files = value;
    const length = files.reduce((l, { name }) => l + name.length, 0);
    const normalizedValue = <FilesValuePreview files={files} />;

    return (
      <div className={wrapperClassname}>
        <div style={{ paddingRight: "0.5rem" }}>{`${capitalizedType}:`}</div>
        <ValuePreview value={normalizedValue} length={length} />
      </div>
    );
  }

  if (type === "html" || type === "text" || type === "string") {
    return (
      <div className={wrapperClassname}>
        <div style={{ paddingRight: "0.5rem" }}>{`${capitalizedType}:`}</div>
        <ValuePreview value={<div dangerouslySetInnerHTML={{ __html: `"${value}"` }} />} length={value.length} />
      </div>
    );
  }

  const valueAsString = `"${value}"`;

  return (
    <div className={wrapperClassname}>
      {type && <div style={{ paddingRight: "0.5rem" }}>{`${capitalizedType}:`}</div>}
      <ValuePreview value={valueAsString} length={valueAsString.length} />
    </div>
  );
};

TypedValuePreview.defaultProps = {
  isVertical: true,
};

TypedValuePreview.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  isVertical: PropTypes.bool,
};

export default TypedValuePreview;
