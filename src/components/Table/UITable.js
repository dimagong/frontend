import "./style.scss";

import _ from "lodash/fp";
import React from "react";
import { Table } from "reactstrap";
import PropTypes from "prop-types";
import classnames from "classnames";

const UITable = ({ headers, customHeader, rows, customRow, className: classNameProp, ...attrs }) => {
  const className = classnames("ui-table", classNameProp);

  return (
    <Table className={className} borderless responsive {...attrs}>
      <thead className="font-weight-bold">
        <tr>
          {headers.map((header, index) => {
            const customHeaderResult = _.isFunction(customHeader) ? customHeader(header, index) : null;

            if (customHeaderResult !== undefined) {
              return customHeaderResult;
            }

            return <th key={header}>{header}</th>;
          })}
        </tr>
      </thead>
      <tbody>{rows.map((row, index) => customRow(row, index) || null)}</tbody>
    </Table>
  );
};

UITable.defaultProps = {
  customHeader: _.noop,
};

UITable.propTypes = {
  headers: PropTypes.array.isRequired,
  customHeader: PropTypes.func,

  rows: PropTypes.array.isRequired,
  customRow: PropTypes.func.isRequired,
};

export default UITable;
