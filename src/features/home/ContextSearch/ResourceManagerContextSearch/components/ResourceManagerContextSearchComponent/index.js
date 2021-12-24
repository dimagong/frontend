import React from 'react';

import OrganizationCard from "components/OrganizationCard";

import './styles.scss'

const ResourceManagerContextSearchComponent = ({ organizations, handleOrganizationSelect }) => {

  return (
    <div className="home__card-wrapper resource-manager-context-search-component">
      {organizations.map((org) => (
        <OrganizationCard key={org.id+org.type} org={org} onSelect={() => {handleOrganizationSelect(org.id, org.type)}} />
      ))}
    </div>
  )
};

export default ResourceManagerContextSearchComponent;
