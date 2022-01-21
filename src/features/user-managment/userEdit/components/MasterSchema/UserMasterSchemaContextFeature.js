import React from "react";
import _ from "lodash/fp";
import { Scrollbars } from "react-custom-scrollbars";

import { INPUT_HEADER_HEIGHT } from "constants/header";

import { UserMasterSchemaProviderContext } from "./UserMasterSchemaProvider";
import UserMasterSchemaVersionsHistoryTable from "./UserMasterSchemaVersionsHistoryTable";

const UserMasterSchemaContextFeature = () => {
  const { userId, selectable } = React.useContext(UserMasterSchemaProviderContext);

  const contextFeatureTitle = (() => {
    if (selectable.selected.nodes.length === 1) {
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

    if (selectable.selected.fields.length > 1) {
      return (
        <>
          {`${selectable.selected.fields.length} Datapoints Selected`}
          {selectable.selected.fields.map((field) => (
            <p className="mb-0 mt-1 font-size-base font-weight-normal" key={field.id}>
              {field.path.join(".")}
            </p>
          ))}
          {selectable.selected.areSelectedFieldsContainCommonAndMemberFirmFields && (
            <p className="mb-0 mt-1 font-size-base font-weight-normal text-danger">
              There are selected fields not from member firm.
            </p>
          )}
        </>
      );
    }

    return null;
  })();

  return (
    <Scrollbars autoHeightMin={550} autoHeight autoHeightMax={window.innerHeight - INPUT_HEADER_HEIGHT}>
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
    </Scrollbars>
  );
};

export default UserMasterSchemaContextFeature;
