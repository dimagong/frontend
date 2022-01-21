import "./styles.scss";

import moment from "moment";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Spinner } from "reactstrap";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";

import { getFullName } from "utility/get-full-name";
import masterSchemaAPI from "api/masterSchema/masterSchema";

import UITable from "components/Table/UITable";
import { TypedValuePreview } from "components/MasterSchemaValuePreviews";

const VersionsHistoryTable = ({ fieldId }) => {
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
      <div className="d-flex justify-content-center py-4">
        <Spinner />
      </div>
    );
  }

  const headers = ["Date", "Value", "User"];

  return (
    <UITable
      headers={headers}
      rows={versions}
      customRow={(version, index) => {
        const { provided } = version;
        const fullName = provided ? getFullName(provided) : null;
        const rowClassName = classNames({ "font-weight-bold": index === 0 });

        return (
          <tr className={rowClassName} key={version.id}>
            <td className="text-left">
              <div>{moment(version?.created_at).format("DD/MM/YYYY")}</div>
              <div>{moment(version?.created_at).format("HH:MM")}</div>
            </td>
            <td>
              <TypedValuePreview type={version.type} value={version.type === "files" ? version.files : version.value} />
            </td>
            <td className="ui-table__right-border">{fullName}</td>
          </tr>
        );
      }}
    />
  );
};

VersionsHistoryTable.propTypes = {
  fieldId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default VersionsHistoryTable;
