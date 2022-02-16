import _ from "lodash/fp";
import React from "react";

import { useMasterSchemaSelected } from "features/MasterSchema/hooks/useMasterSchemaSelected";

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
    <React.Profiler
      id="user-master-schema-context-feature"
      onRender={(id, phase) => console.log(id, phase, { selected })}
    >
      <div className="context-feature-template_container">
        <div className="context-feature-template_header">
          {contextFeatureTitle ? (
            <div className="context-feature-template_header_title">{contextFeatureTitle}</div>
          ) : null}
        </div>

        {/* should it check is_system prop of the field */}
        {selected.fields.length === 1 ? (
          <UserMasterSchemaVersionsHistoryTable userId={user.id} fieldId={selected.field.id} />
        ) : null}
      </div>
    </React.Profiler>
  );
};

export default UserMasterSchemaContextFeature;
