import _ from "lodash/fp";
import React, { memo } from "react";
import { Card, CardBody } from "reactstrap";

import { UserMasterSchemaProviderContext } from "./UserMasterSchemaProvider";
import UserMasterSchemaHierarchy from "./components/UserMasterSchemaHierarchy/UserMasterSchemaHierarchy";

const UserMasterSchemaContext = memo(function UserMasterSchemaContext() {
  const { user, selectedNodes, selectNode, setContextFeature, resetSelected } = React.useContext(
    UserMasterSchemaProviderContext
  );

  // Reset previous selected nodes cause its behaves to high component
  // which is <UserMasterSchemaProvider />
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => void resetSelected(), [user.id]);

  React.useEffect(() => {
    // set context to display <UserMasterSchemaContextFeature />
    // only when some field is selected
    if (!_.isEmpty(selectedNodes)) {
      setContextFeature();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNodes]);

  return (
    <Card>
      <CardBody className="pt-0">
        <UserMasterSchemaHierarchy
          userId={user.id}
          organizationName={user.permissions.organization}
          selectedNodes={selectedNodes}
          onSelect={selectNode}
        />
      </CardBody>
    </Card>
  );
});

export default UserMasterSchemaContext;
