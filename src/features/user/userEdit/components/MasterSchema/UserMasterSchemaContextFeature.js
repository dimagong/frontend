import _ from "lodash/fp";
import React from "react";

import { useMasterSchemaSelected } from "features/masterSchema/hooks/useMasterSchemaSelected";

import UserMSFieldManager from "./components/UserMSFieldManager";
import { UserMasterSchemaProviderContext } from "./UserMasterSchemaProvider";
import UserMasterSchemaVersionsHistoryTable from "./UserMasterSchemaVersionsHistoryTable";

const UserMasterSchemaContextFeature = () => {
  const { user, selectedNodes } = React.useContext(UserMasterSchemaProviderContext);

  const selected = useMasterSchemaSelected(selectedNodes);

  const contextFeatureTitle = (() => {
    if (selected.fields.length === 1) {
      const path = [...selected.node.path];
      const firstName = path.shift();
      const restNames = _.isEmpty(path) ? null : `.${path.join(".")}`;

      return (
        <>
          {firstName}
          {restNames && <span className="font-weight-normal">{restNames}</span>}
        </>
      );
    }

    return null;
  })();

  return (
    <div className="context-feature-template_container">
      <div className="context-feature-template_header">
        {contextFeatureTitle ? (
          <div className="context-feature-template_header_title">{contextFeatureTitle}</div>
        ) : null}
      </div>

      {selected.fields.length === 1 ? (
        <React.Fragment key={selected.field.id}>
          <UserMSFieldManager userId={user.id} msFieldId={selected.field.id} />
          <UserMasterSchemaVersionsHistoryTable userId={user.id} fieldId={selected.field.id} />
        </React.Fragment>
      ) : null}
    </div>
  );
};

export default UserMasterSchemaContextFeature;
