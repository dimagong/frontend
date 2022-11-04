import "./styles.scss";

import React from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash/fp";

import ContextFeatureTemplate from "components/ContextFeatureTemplate";
import { useMasterSchemaSelected } from "features/masterSchema/hooks/useMasterSchemaSelected";

import MasterSchemaUser from "./components/MasterSchemaUser";
import MasterSchemaManager from "./components/MasterSchemaManager";

const MasterSchemaContextFeature = ({ masterSchemaId, selectedNodes }) => {
  const selected = useMasterSchemaSelected(selectedNodes);

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

  const renderFeatures = () => {
    const features = [];

    if (selected.fields.length === 1 && selected.field) {
      features.push(<MasterSchemaUser field={selected.field} key="user" />);
    }

    if (selected.nodes.length > 0) {
      features.push(<MasterSchemaManager masterSchemaId={masterSchemaId} selected={selected} key="managers" />);
    }

    return features;
  };

  return <ContextFeatureTemplate contextFeatureTitle={renderTitle()}>{renderFeatures()}</ContextFeatureTemplate>;
};

MasterSchemaContextFeature.propTypes = {
  masterSchemaId: PropTypes.number.isRequired,
  selectedNodes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default MasterSchemaContextFeature;
