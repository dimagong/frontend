import "./styles.scss";

import React from "react";
import PropTypes from "prop-types";

import OrganizationCard from "components/OrganizationCard";

const RMList = ({ rManagers, onSelect: propOnSelect }) => {
  const onSelect = (rManager) => () => propOnSelect(rManager);

  return (
    <>
      {rManagers.map((rManager) => (
        <OrganizationCard
          key={rManager.organization_id + rManager.organization_type}
          org={rManager.organization}
          onSelect={onSelect(rManager)}
        />
      ))}
    </>
  );
};

RMList.propTypes = {
  rManagers: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default RMList;
