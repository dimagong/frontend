import React from "react";
import _ from "lodash/fp";

import { UserMasterSchemaProviderContext } from "./UserMasterSchemaProvider";
import UserMasterSchemaVersionsHistoryTable from "./UserMasterSchemaVersionsHistoryTable";
import UsersMSElementType from "./components/users-ms-element-type-field";
import UsersMSResourceLink from "./components/user-ms-element-resource-link";
import UsersMSVersionField from "./components/user-ms-element-version-field";

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

      <UsersMSElementType inputValue={'Initial value'}/>
      <UsersMSResourceLink inputValue={'Initial value'}/>
      <UsersMSVersionField inputValue={'Initial value'}/>

      {/* should it check is_system prop of the field */}
      {selectable.selected.fields.length === 1 ? (
        <UserMasterSchemaVersionsHistoryTable userId={userId} fieldId={selectable.selected.field.id} />
      ) : null}
    </div>
  );
};

export default UserMasterSchemaContextFeature;
