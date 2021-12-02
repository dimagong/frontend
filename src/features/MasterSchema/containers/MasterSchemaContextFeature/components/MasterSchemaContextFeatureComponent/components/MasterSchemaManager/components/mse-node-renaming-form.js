import React from "react";
import PropTypes from "prop-types";
import { CardTitle, Col, Label, Row } from "reactstrap";

import { useFormField, useFormGroup, Validators } from "hooks/use-form";

import MSEButton from "features/MasterSchema/share/mse-button";
import MSETextField from "features/MasterSchema/share/mse-text-field";
import MSEEditorForm from "features/MasterSchema/share/mse-editor-form";

const MSENodeRenamingForm = ({ name: initialName, submitting, label, action, onSubmit: propOnSubmit, ...attrs }) => {
  const [name, setName] = useFormField(initialName, [Validators.required, Validators.identical(initialName)]);
  const form = useFormGroup({ name });

  const onSubmit = () => propOnSubmit(form);

  return (
    <MSETextField
      name="elementName"
      onChange={({ target }) => setName(target.value)}
      {...name}
      label={(id) => (
        <Label for={id}>
          <CardTitle>{label}</CardTitle>
        </Label>
      )}
    >
      {({ input, label, error }) => (
        <MSEEditorForm
          onSubmit={onSubmit}
          header={label}
          body={
            <Row>
              <Col xs={8}>
                {input}
                {error}
              </Col>
              <Col xs={4}>
                <MSEButton
                  className="w-100"
                  color="primary"
                  type="submit"
                  disabled={form.invalid}
                >
                  {action}
                </MSEButton>
              </Col>
            </Row>
          }
          {...attrs}
        />
      )}
    </MSETextField>
  );
};

MSENodeRenamingForm.defaultProps = {
  submitting: false,
};

MSENodeRenamingForm.propTypes = {
  name: PropTypes.string.isRequired,
  submitting: PropTypes.bool,
  label: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default MSENodeRenamingForm;
