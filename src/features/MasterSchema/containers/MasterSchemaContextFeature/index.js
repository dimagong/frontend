import "./styles.scss";

import React from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash/fp";

import ContextFeatureTemplate from "components/ContextFeatureTemplate";

import MasterSchemaUser from "./components/MasterSchemaUser";
import MasterSchemaManager from "./components/MasterSchemaManager";

const MasterSchemaContextFeature = ({ selectable }) => {
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

  const renderFeatures = () => {
    const features = [];

    if (selectable.selected.fields.length === 1 && selectable.selected.field) {
      features.push(<MasterSchemaUser field={selectable.selected.field} key="user" />);
    }

    if (selectable.selected.nodes.length > 0) {
      features.push(<MasterSchemaManager selectable={selectable} key="managers" />);
    }

    return features;
  };

  return <ContextFeatureTemplate contextFeatureTitle={renderTitle()}>{renderFeatures()}</ContextFeatureTemplate>;
};

MasterSchemaContextFeature.propTypes = {
  selectable: PropTypes.object,
};

export default MasterSchemaContextFeature;
