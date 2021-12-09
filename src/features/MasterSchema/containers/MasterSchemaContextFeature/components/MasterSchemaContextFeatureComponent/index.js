import "./styles.scss";

import React from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash/fp";

import ContextFeatureTemplate from "components/ContextFeatureTemplate";

import MasterSchemaManager from "./components/MasterSchemaManager";

const MasterSchemaContextFeatureComponent = ({ state }) => {
  const { selected } = state;

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
      <MasterSchemaManager state={state} />
    </ContextFeatureTemplate>
  );
};

MasterSchemaContextFeatureComponent.propTypes = {
  state: PropTypes.object.isRequired,
};

export default MasterSchemaContextFeatureComponent;
