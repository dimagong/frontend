import PropTypes from "prop-types";
import React, { memo } from "react";
import { Col, Row } from "reactstrap";

import UserMasterSchemaHierarchySearch from "./UserMasterSchemaHierarchySearch";

const stickyStyle = { top: "0px", left: "0px", backgroundColor: "#fff" };

function UserMasterSchemaHierarchyTemplate(props) {
  const { organizationName, onSearch, children } = props;

  return (
    <Row className="position-relative">
      <Col>
        <div className="position-sticky zindex-1 pt-2" style={stickyStyle}>
          <UserMasterSchemaHierarchySearch onSearch={onSearch} organizationName={organizationName} />
        </div>

        {children}
      </Col>
    </Row>
  );
}

UserMasterSchemaHierarchyTemplate.propTypes = {
  onSearch: PropTypes.func.isRequired,
  organizationName: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default UserMasterSchemaHierarchyTemplate;
