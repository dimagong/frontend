import React from "react";
import _ from "lodash/fp";

import { UserMasterSchemaProviderContext } from "./UserMasterSchemaProvider";
import UserMasterSchemaVersionsHistoryTable from "./UserMasterSchemaVersionsHistoryTable";

const UserMasterSchemaContextFeature = () => {
  const { userId, selectable } = React.useContext(UserMasterSchemaProviderContext);

  const contextFeatureTitle = (() => {
    if (selectable.selected.fields.length === 1) {
      const path = [...selectable.selected.node.path];
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

      {/* should it check is_system prop of the field */}
      {selectable.selected.fields.length === 1 ? (
        <UserMasterSchemaVersionsHistoryTable userId={userId} fieldId={selectable.selected.field.id} />
      ) : null}
    </div>
  );
};

export default UserMasterSchemaContextFeature;
