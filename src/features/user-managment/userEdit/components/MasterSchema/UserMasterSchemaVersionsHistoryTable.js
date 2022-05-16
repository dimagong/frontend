import React from "react";
import { Card, CardBody } from "reactstrap";

import { IdType } from "utility/prop-types";

import VersionsHistoryTable from "components/MasterSchemaVersionsHistory/VersionsHistoryTable";

import { useMasterSchemaFieldValueHistory } from "api/masterSchema/fieldValue/masterSchemaFieldValueQueries";

const UserMasterSchemaVersionsHistoryTable = React.memo(({ userId, fieldId }) => {
  const { data: versions, isLoading } = useMasterSchemaFieldValueHistory({ userId, fieldId });

  return (
    <>
      <h1 className="font-weight-bold mb-1">History</h1>
      <Card>
        <CardBody>
          <VersionsHistoryTable versions={versions} isLoading={isLoading} />
        </CardBody>
      </Card>
    </>
  );
});

UserMasterSchemaVersionsHistoryTable.propTypes = {
  userId: IdType.isRequired,
  fieldId: IdType.isRequired,
};

export default UserMasterSchemaVersionsHistoryTable;
