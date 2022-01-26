import "./styles.scss";

import _ from "lodash/fp";
import moment from "moment";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Spinner } from "reactstrap";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";

import { getFullName } from "utility/get-full-name";

import UITable from "components/Table/UITable";
import { TypedValuePreview } from "components/MasterSchemaValuePreviews";

const VersionsHistoryTable = ({ versionsFactory }) => {
  const [versions, setVersions] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    versionsFactory()
      .then((versions) => isMounted && setVersions(versions))
      .catch((error) => toast.error(error))
      .finally(() => setIsLoading(false));

    return () => (isMounted = false);
  }, [versionsFactory]);

  if (!versions && isLoading) {
    return (
      <div className="d-flex justify-content-center py-4">
        <Spinner />
      </div>
    );
  }

  if (!versions || _.isEmpty(versions)) {
    return <h2 style={{ color: "#707070" }}>There are no versions.</h2>;
  }

  const headers = ["Date", "Value", "User"];

  return (
    <UITable
      className="versions-table"
      headers={headers}
      rows={versions}
      customHeader={(header) => (
        <th className="versions-table__th" key={header}>
          {header}
        </th>
      )}
      customRow={(version, index) => {
        const { provided } = version;
        const fullName = provided ? getFullName(provided) : null;
        const lastTdClassName = { "ui-table__right-border": index === 0 };
        const rowClassName = classNames({ "versions-table__tr--actual font-weight-bold": index === 0 });

        return (
          <tr className={rowClassName} key={version.id}>
            <td className="versions-table__td text-left">
              <div>{moment(version?.created_at).format("DD/MM/YYYY")}</div>
              <div>{moment(version?.created_at).format("HH:MM")}</div>
            </td>
            <td className="versions-table__td">
              <TypedValuePreview type={version.type} value={version.type === "files" ? version.files : version.value} />
            </td>
            <td className={classNames("versions-table__td", lastTdClassName)}>{fullName}</td>
          </tr>
        );
      }}
    />
  );
};

VersionsHistoryTable.propTypes = {
  versionsFactory: PropTypes.func.isRequired,
};

export default VersionsHistoryTable;
