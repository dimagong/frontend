import React from 'react';

import OrganizationCard from "components/OrganizationCard";

import './styles.scss'

const ResourceManagerContextSearchComponent = ({
  resourceManagersList,
  handleResourceManagerSelect,
  isLoading,
}) => {

  return (
    <div className="home__card-wrapper resource-manager-context-search-component">
      {resourceManagersList.map((resourceManager) => (
        <OrganizationCard
          key={resourceManager.organization_id+resourceManager.organization_type}
          org={resourceManager.organization}
          onSelect={() => {handleResourceManagerSelect(resourceManager)}}
        />
      ))}
    </div>
  )
};

export default ResourceManagerContextSearchComponent;
