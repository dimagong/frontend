import "./styles.scss";

import React from "react";
import { isEmpty } from "lodash/fp";

import ContextFeatureTemplate from "components/ContextFeatureTemplate";

import { useMasterSchemaContext } from "features/MasterSchema/use-master-schema-context";

import MasterSchemaManager from "./components/MasterSchemaManager";

const MasterSchemaContextFeatureComponent = () => {
  const { selectable } = useMasterSchemaContext();

  const renderTitle = () => {
    if (selectable.selected.nodes.length === 1) {
      const path = [...selectable.selected.node.path];
      const firstName = path.shift();
      const restNames = isEmpty(path) ? null : `.${path.join(".")}`;

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
  };

  return (
    <ContextFeatureTemplate contextFeatureTitle={renderTitle()}>
      {/*<MasterSchemaUserList />*/}
      <MasterSchemaManager />
    </ContextFeatureTemplate>
  );
};

export default MasterSchemaContextFeatureComponent;
