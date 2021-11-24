import React from "react";
import PropTypes from "prop-types";
import { CardTitle, Label } from "reactstrap";

import { preventDefault } from "utility/event-decorators";
import MSETextField from "features/MasterSchema/share/mse-text-field";
import { useFormField, useFormGroup, Validators } from "hooks/use-form";

import MSENodeEditorForm from "./mse-node-editor-form";

const MSENodeRenamingForm = ({ name: initialName, submitting, onSubmit: propOnSubmit, ...attrs }) => {
  // Form implementation
  const valueChanged = (v) => v !== initialName;
  const [name, setName] = useFormField(initialName, [Validators.required, valueChanged]);
  const form = useFormGroup({ name });

  const onSubmit = () => propOnSubmit(form);

  return (
    <MSETextField
      name="elementName"
      onChange={({ target }) => setName(target.value)}
      {...name}
      label={(id) => (
        <Label for={id}>
          <CardTitle>Rename datapoint to:</CardTitle>
        </Label>
      )}
    >
      {({ input, label, error }) => (
        <MSENodeEditorForm
          buttonText="Rename"
          invalid={form.invalid}
          submitting={submitting}
          onSubmit={preventDefault(onSubmit)}
          label={label}
          field={
            <>
              {input}
              {error}
            </>
          }
          {...attrs}
        />
      )}
    </MSETextField>
  );
};

MSENodeRenamingForm.propTypes = {
  name: PropTypes.string.isRequired,
  submitting: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default MSENodeRenamingForm;
