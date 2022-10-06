import PropTypes from "prop-types";
import React from "react";
import { Col, Row } from "reactstrap";

import { preventDefault } from "utility/event-decorators";

import { useFormGroup, useFormField, Validators } from "hooks/use-form";

import { DFormTextWidget } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormTextWidget";
import { NpmButton } from "features/nmp-ui";

export const AHCreateCategoryForm = ({ placeholder, submitting, onSubmit: propOnSubmit }) => {
  const [name, setName] = useFormField("", [Validators.required]);
  const formGroup = useFormGroup({ name });

  const onSubmit = preventDefault(() => propOnSubmit(formGroup));

  return (
    <form onSubmit={onSubmit}>
      <Row className="my-3">
        <Col>
          <DFormTextWidget
            id="field-name"
            label={"Name"}
            placeholder={placeholder}
            isError={false}
            isRequired={true}
            isDisabled={false}
            isLabelShowing={true}
            onChange={(value) => setName(value)}
            value={name.value}
          />
        </Col>
      </Row>

      <Row className="my-3">
        <Col>
          <div className="d-flex justify-content-end">
            <NpmButton key="submit" type="primary" onClick={onSubmit} disabled={formGroup.invalid} loading={submitting}>
              Save
            </NpmButton>
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
