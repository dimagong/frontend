import PropTypes from "prop-types";
import { Col, Row } from "reactstrap";
import React, { useState } from "react";

import { useFormGroup, useFormField, Validators } from "hooks/use-form";

import MSEButton from "./mse-button";
import MSETextField from "./mse-text-field";
import MSESelectField from "./mse-select-field";

import { preventDefault } from "../event-decorators";

const computeOptionsFromArray = (array) => array.map((value) => ({ label: value, value }));

const MSECreateElementForm = ({ submitting, onSubmit: propOnSubmit }) => {
  const [elementPath, setElementPath] = useFormField("", [Validators.required]);
  const [elementTypeOptions] = useState(computeOptionsFromArray(["select", "text"]));
  const [elementType, setElementType] = useFormField(null, [Validators.required]);
  const formGroup = useFormGroup({
    elementPath,
    elementType,
  });

  const onSubmit = preventDefault(() => propOnSubmit(formGroup));

  return (
    <form onSubmit={onSubmit}>
      <Row className="my-3">
        <Col className="ms-elements__input-field">
          <MSETextField
            label="Element location and name"
            name="elementPath"
            placeholder="MS.ValidPath.bio.firstName"
            onChange={({ target }) => setElementPath(target.value)}
            {...elementPath}
          />
        </Col>
      </Row>

      <Row className="my-3">
        <Col className="ms-elements__input-field">
          <MSESelectField
            label="Element type"
            name="elementType"
            placeholder="New option"
            options={elementTypeOptions}
            onChange={setElementType}
            {...elementType}
          />
        </Col>
      </Row>

      <Row className="my-3">
        <Col>
          <div className="d-flex justify-content-end">
            <MSEButton color="primary" disabled={formGroup.invalid} loading={submitting} type="submit">
              Create
            </MSEButton>
          </div>
        </Col>
      </Row>
    </form>
  );
};

MSECreateElementForm.propTypes = {
  submitting: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default MSECreateElementForm;
