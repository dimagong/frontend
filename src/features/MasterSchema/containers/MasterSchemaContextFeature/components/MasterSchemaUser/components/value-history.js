import moment from "moment";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { Col, Spinner, Table } from "reactstrap";
import React, { useEffect, useState } from "react";

import { getFullName } from "utility/get-full-name";
import masterSchemaAPI from "api/masterSchema/masterSchema";

import TypedValuePreview from "./typed-value-preview";

const ValueHistory = ({ fieldId }) => {
  const [versions, setVersions] = useState(null);

  useEffect(() => {
    let isMounted = true;

    masterSchemaAPI
      .getFieldVersions({ fieldId })
      .then((versions) => isMounted && setVersions(versions))
      .catch((error) => toast.error(error));

    return () => (isMounted = false);
  }, [fieldId]);

  if (!versions) {
    return (
      <tr>
        <td colSpan="3">
          <Col className="d-flex justify-content-center py-4">
            <Spinner />
          </Col>
        </td>
      </tr>
    );
  }

  return (
    <Table className="msu-table" borderless responsive>
      <thead>
        <tr className="msu-table__history-head">
          <th>Date</th>
          <th>Value</th>
          <th>User</th>
        </tr>
      </thead>
      <tbody>
        {versions.map((version) => {
          const { provided } = version;
          const fullName = provided ? getFullName(provided) : null;
          return (
            <tr className="msu-table__row--history" key={version.id}>
              <td className="msu-table__date--start">
                <div>{moment(version?.created_at).format("DD/MM/YYYY")}</div>
                <div>{moment(version?.created_at).format("HH:MM")}</div>
              </td>
              <td>
                <TypedValuePreview
                  type={version.type}
                  value={version.type === "files" ? version.files : version.value}
                />
              </td>
              <td>{fullName}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

ValueHistory.propTypes = {
  fieldId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
};

export default ValueHistory;
