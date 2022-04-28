import _ from "lodash/fp";
import PropTypes from "prop-types";
import { Col, Label, Row } from "reactstrap";
import React, { useCallback, useState } from "react";

import NmpButton from "components/nmp/NmpButton";
import NmpPlainInput from "components/nmp/NmpPlainInput";

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
        <NmpPlainInput value={value} onChange={setValue} id="prospect-filename" />
      </Col>
      <Col xs={6}>
        <NmpButton color="primary" onClick={renameField} disabled={_.isEmpty(value)}>
          Rename filename
        </NmpButton>
      </Col>
    </Row>
  );
};

RMFieldRenameForm.propTypes = {
  field: PropTypes.object.isRequired,
};

export default RMFieldRenameForm;
