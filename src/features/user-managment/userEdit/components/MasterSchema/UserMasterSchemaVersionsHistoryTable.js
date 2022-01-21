import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody } from "reactstrap";

import masterSchemaApi from "api/masterSchema/masterSchema";

import VersionsHistoryTable from "components/MasterSchemaVersionsHistory/VersionsHistoryTable";

const titleStyle = {
  fontSize: "2.4rem",
  color: "#707070",
};

const UserMasterSchemaVersionsHistoryTable = ({ userId, fieldId }) => {
  const versionsFactory = () => masterSchemaApi.getVersionsByFieldAndUser({ userId, fieldId });

  return (
    <>
      <h1 className="font-weight-bold mb-1" style={titleStyle}>
        History
      </h1>
      <Card>
        <CardBody>
          <VersionsHistoryTable versionsFactory={versionsFactory} />
        </CardBody>
      </Card>
    </>
  );
};

UserMasterSchemaVersionsHistoryTable.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  fieldId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default UserMasterSchemaVersionsHistoryTable;
