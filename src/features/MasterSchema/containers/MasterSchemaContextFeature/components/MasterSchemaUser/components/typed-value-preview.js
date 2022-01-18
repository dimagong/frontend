import _ from "lodash/fp";
import { PropTypes } from "prop-types";
import React, { useMemo } from "react";

import ValuePreview from "./value-preview";
import FilesValuePreview from "./files-value-preview";

const TypedValuePreview = ({ type, value }) => {
  const capitalizedType = useMemo(() => _.capitalize(type), [type]);

  if (!value) {
    return type ? `${capitalizedType}: Null` : "Null";
  }

  if (type === "boolean") {
    const normalizedValue = value ? "Yes" : "No";

    return (
      <>
        <div>{`${capitalizedType}:`}</div>
        <ValuePreview value={normalizedValue} length={3} />
      </>
    );
  }

  if (type === "files") {
    const files = value;
    const length = files.reduce((l, { name }) => l + name.length, 0);
    const normalizedValue = <FilesValuePreview files={files} />;

    return (
      <>
        <div>{`${capitalizedType}:`}</div>
        <ValuePreview value={normalizedValue} length={length} />
      </>
    );
  }

  if (type === "html") {
    return (
      <>
        <div>{`${capitalizedType}:`}</div>
        <ValuePreview value={<div dangerouslySetInnerHTML={{ __html: value }} />} length={value.length} />
      </>
    );
  }

  const valueAsString = String(value);

  return (
    <>
      {type && <div>{`${capitalizedType}:`}</div>}
      <ValuePreview value={valueAsString} length={valueAsString.length} />
    </>
  );
};

TypedValuePreview.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    // When type is "files" the value is array of { name: string } objects.
    PropTypes.arrayOf(PropTypes.object),
  ]).isRequired,
};

export default TypedValuePreview;
