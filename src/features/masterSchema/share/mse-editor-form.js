import React from "react";
import PropTypes from "prop-types";
import { Card, CardHeader, CardBody } from "reactstrap";

import { preventDefault } from "utility/event-decorators";

const MSEEditorForm = ({ onSubmit, header, body, ...attrs }) => {
  return (
    <Card
      tag="form"
      style={{ boxShadow: "none", border: "1px solid #ececec" }}
      onSubmit={preventDefault(onSubmit)}
      {...attrs}
    >
      <CardHeader>{header}</CardHeader>
      <CardBody>{body}</CardBody>
    </Card>
  );
};

MSEEditorForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,

  header: PropTypes.node.isRequired,
  body: PropTypes.node.isRequired,
};

export default MSEEditorForm;
