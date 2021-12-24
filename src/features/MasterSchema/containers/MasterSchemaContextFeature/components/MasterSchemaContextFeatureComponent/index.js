import "./styles.scss";

import React from "react";
import { isEmpty } from "lodash/fp";

import ContextFeatureTemplate from "components/ContextFeatureTemplate";
import { useMasterSchemaContext } from "features/MasterSchema/use-master-schema-context";

import MasterSchemaUser from "./components/MasterSchemaUser";
import MasterSchemaManager from "./components/MasterSchemaManager";

const MasterSchemaContextFeatureComponent = () => {
  const { selectable: { selected } } = useMasterSchemaContext();

  const renderTitle = () => {
    if (selected.nodes.length === 1) {
      const path = [...selected.node.path];
      const firstName = path.shift();
      const restNames = isEmpty(path) ? null : `.${path.join(".")}`;

      return (
        <>
          {firstName}
          {restNames && <span className="font-weight-normal">{restNames}</span>}
        </>
      );
    }

    if (selected.fields.length > 1) {
      return (
        <>
          {`${selected.fields.length} Datapoints Selected`}
          {selected.fields.map((field) => (
            <p className="mb-0 mt-1 font-size-base font-weight-normal" key={field.id}>
              {field.path.join(".")}
            </p>
          ))}
          {selected.areSelectedFieldsContainCommonAndMemberFirmFields && (
            <p className="mb-0 mt-1 font-size-base font-weight-normal text-danger">
              There are selected fields not from member firm.
            </p>
          )}
        </>
      );
    }
  };

  const renderUsers = () => {
    if (selected.fields.length === 1 && selected.field) {
      return <MasterSchemaUser field={selected.field} />
    }

    return null;
  };

  return (
    <ContextFeatureTemplate contextFeatureTitle={renderTitle()}>
      {renderUsers()}
      <MasterSchemaManager />
    </ContextFeatureTemplate>
  );
};

export default MasterSchemaContextFeatureComponent;
