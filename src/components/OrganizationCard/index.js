import "./styles.scss";

import React from "react";
import propTypes from "prop-types";

import { Card, CardBody } from "reactstrap";

import NmpOrganizationLogo from "../nmp/NmpOrganizationLogo";

const OrganizationCard = ({ org, onSelect, className }) => {
  const handleOrgSelect = () => {
    if (!org.logo?.isLoading) {
      onSelect(org.id, org.type);
    }
  };

  return (
    <Card className={`organization-card_wrapper ${className ? className : ""}`} key={org.name}>
      <CardBody className="organization-card" onClick={handleOrgSelect}>
        <NmpOrganizationLogo
          fileId={org.logo?.id}
          organizationId={org.id}
          organizationType={org.type}
          organizationName={org.name}
        />
      </CardBody>
    </Card>
  );
};

OrganizationCard.propTypes = {
  org: propTypes.shape({
    id: propTypes.number.isRequired,
    name: propTypes.string.isRequired,
    type: propTypes.string,
  }),
  onSelect: propTypes.func,
};

export default OrganizationCard;
