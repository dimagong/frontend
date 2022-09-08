import React from "react";
import PropTypes from "prop-types";
import { Row, Col } from "reactstrap";

import { ApplicationDescriptionFormFields } from "./ApplicationDescriptionFormFields";

export const ApplicationDescription = ({ name, description, isPrivate, organizationName, onChange }) => {
  return (
    <Row className="px-3">
      <Col md="12">
        <div className="d-flex mb-2 font-size-large">
          <div className="font-weight-bold">Organization</div>
          <div className="pl-1 w-100">{organizationName}</div>
        </div>

        <ApplicationDescriptionFormFields
          name={name}
          description={description}
          isPrivate={isPrivate}
          onChange={onChange}
        />
      </Col>
    </Row>
  );
};

ApplicationDescription.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  isPrivate: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  organizationName: PropTypes.string.isRequired,
};
