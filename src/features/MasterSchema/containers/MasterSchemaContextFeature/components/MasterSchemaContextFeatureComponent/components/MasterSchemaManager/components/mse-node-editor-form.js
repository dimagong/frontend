import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";

import MSEButton from "features/MasterSchema/share/mse-button";

const MSENodeEditorForm = ({ invalid, submitting, buttonText, onSubmit, label, field, ...attrs }) => {
  return (
    <Card tag="form" onSubmit={onSubmit} {...attrs}>
      <CardHeader>{label}</CardHeader>
      <CardBody>
        <Row>
          <Col xs={8}>{field}</Col>
          <Col xs={4}>
            <MSEButton
              className="w-100"
              backgroundColor="#ABABAB4D"
              textColor="#fff"
              type="submit"
              disabled={invalid}
              loading={submitting}
            >
              {buttonText}
            </MSEButton>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

MSENodeEditorForm.propTypes = {
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  buttonText: PropTypes.string.isRequired,

  onSubmit: PropTypes.func.isRequired,

  label: PropTypes.node.isRequired,
  field: PropTypes.node.isRequired,
};

export default MSENodeEditorForm;
