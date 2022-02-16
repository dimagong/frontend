import _ from "lodash/fp";
import React from "react";
import { Card, CardBody } from "reactstrap";

import UserMasterSchemaHierarchy from "./UserMasterSchemaHierarchy";
import { UserMasterSchemaProviderContext } from "./UserMasterSchemaProvider";

const UserMasterSchemaContext = () => {
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
    <React.Profiler
      id="user-master-schema-context"
      onRender={(id, phase) => console.log(id, phase, { selectedNodes })}
    >
      <Card>
        <CardBody className="pt-0">
          <UserMasterSchemaHierarchy userId={user.id} hierarchyName={user.permissions.organization} selectedNodes={selectedNodes} onSelect={selectNode} />
        </CardBody>
      </Card>
    </React.Profiler>
  );
};

export default UserMasterSchemaContext;
