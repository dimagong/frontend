import React from "react";
import propTypes from "prop-types";

import { Card, CardBody, Spinner } from "reactstrap";

import "./styles.scss";

const OrganizationCard = ({ org, onSelect, className }) => {
  const handleOrgSelect = () => {
    if (!org.logo?.isLoading) {
      onSelect(org.id, org.type);
    }
  };

  return (
    <Card className={`organization-card_wrapper ${className ? className : ""}`} key={org.name}>
      <CardBody className="organization-card" onClick={handleOrgSelect}>
        {org.logo?.isLoading ? (
          <div className="spinner-wrapper">
            <Spinner color="primary" />
          </div>
        ) : (
          <img src={org.logo?.base64} alt={org.name} />
        )}
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
