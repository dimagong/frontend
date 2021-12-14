import "./styles.scss";

import React from "react";
import { isEmpty } from "lodash/fp";

import ContextFeatureTemplate from "components/ContextFeatureTemplate";

import { useMasterSchemaContext } from "features/MasterSchema/use-master-schema-context";

import MasterSchemaManager from "./components/MasterSchemaManager";

const MasterSchemaContextFeatureComponent = () => {
  const { selected } = useMasterSchemaContext();

  const renderTitle = () => {
    if (selected.nodes.length === 1) {
      const path = [...selected.node.path];
      const firstName = path.shift();
      const restNames = isEmpty(path) ? null : `.${path.join(".")}`;

      return (
        <>
          {firstName}
          { restNames && <span className="font-weight-normal">{restNames}</span> }
        </>
      );
    }

    if (selected.fields.length > 1) {
      return `${selected.fields.length} Datapoints Selected`;
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
