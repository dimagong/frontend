import "./styles.scss";

import React from "react";
import PropTypes from "prop-types";

import OrganizationCard from "components/OrganizationCard";

const RMList = ({ resourceManagers, onSelect: propOnSelect }) => {
  const onSelect = (resourceManager) => () => propOnSelect(resourceManager);

  return (
    <>
      {resourceManagers.map((resourceManager) => (
        <OrganizationCard
          key={resourceManager.id}
          org={resourceManager.organization}
          onSelect={onSelect(resourceManager)}
        />
      ))}
    </>
  );
};

RMList.propTypes = {
  resourceManagers: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default RMList;
