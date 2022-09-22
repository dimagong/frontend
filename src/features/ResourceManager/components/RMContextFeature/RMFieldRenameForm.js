import _ from "lodash/fp";
import PropTypes from "prop-types";
import { Col, Label, Row } from "reactstrap";
import React, { useCallback, useState } from "react";

import DeprecatedNmpButton from "components/nmp/DeprecatedNmpButton";
import DeprecatedNmpPlainInput from "components/nmp/DeprecatedNmpPlainInput";

import { useSetRMHierarchyFieldCustomFilename } from "api/resourceManager/useRMHierarchies";
import { toast } from "react-toastify";

const RMFieldRenameForm = ({ resourceManagerId, field }) => {
  const [value, setValue] = useState(field.customFilename);

  const setRMFieldCustomFilename = useSetRMHierarchyFieldCustomFilename(
    { resourceManagerId, fieldId: field.id },
    {
      onSuccess: () => toast.success("Field's prospect download filename changed successfully."),
    }
  );

  const renameField = useCallback(() => {
    setRMFieldCustomFilename.mutate({ custom_filename: value.trim() });
  }, [setRMFieldCustomFilename, value]);

  return (
    <Row className="py-1">
      <Col xs={12}>
        <Label for="prospect-filename">Prospect only filename</Label>
      </Col>
      <Col xs={6}>
        <DeprecatedNmpPlainInput value={value} onChange={setValue} id="prospect-filename" />
      </Col>
      <Col xs={6}>
        <DeprecatedNmpButton color="primary" onClick={renameField} disabled={_.isEmpty(value)}>
          Rename filename
        </DeprecatedNmpButton>
      </Col>
    </Row>
  );
};

RMFieldRenameForm.propTypes = {
  field: PropTypes.object.isRequired,
};

export default RMFieldRenameForm;
