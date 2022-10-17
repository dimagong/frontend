import PropTypes from "prop-types";
import React from "react";
import { Col, Row } from "reactstrap";

import { preventDefault } from "utility/event-decorators";

import { useFormGroup, useFormField, Validators } from "hooks/use-form";

import { NmpInput, NmpButton } from "features/nmp-ui";
import { DFormLabel } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormLabel";

export const AHCreateCategoryForm = ({ placeholder, submitting, onSubmit: propOnSubmit }) => {
  const [name, setName] = useFormField("", [Validators.required]);
  const formGroup = useFormGroup({ name });

  const onSubmit = preventDefault(() => propOnSubmit(formGroup));

  return (
    <form onSubmit={onSubmit}>
      <Row className="my-3">
        <Col>
          <div>
            <DFormLabel label="Name" id="field-name" />
            <NmpInput
              id="field-name"
              type="text"
              value={name.value}
              placeholder={placeholder}
              onChange={({ target }) => setName(target.value)}
            />
          </div>
        </Col>
      </Row>

      <Row className="my-3">
        <Col>
          <div className="d-flex justify-content-end">
            <NmpButton key="submit" type="primary" onClick={onSubmit} disabled={formGroup.invalid} loading={submitting}>
              Save
            </NmpButton>
          </div>
        </Col>
      </Row>
    </form>
  );
};

AHCreateCategoryForm.propTypes = {
  placeholder: PropTypes.string.isRequired,
  submitting: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
