import React from "react";
import PropTypes from "prop-types";
import { CardTitle, Label } from "reactstrap";

import { preventDefault } from "utility/event-decorators";
import { useFormField, useFormGroup, Validators } from "hooks/use-form";
import MSESelectField from "features/MasterSchema/share/mse-select-field";

import MSENodeEditorForm from "./mse-node-editor-form";

const MOCK_LOCATIONS = [{ label: "ValidPath.FCA.number", value: "1.2.3" }];

const MSENodeRelocationForm = ({ node, submitting, onSubmit: propOnSubmit, ...attrs }) => {
  // Form implementation
  const [elementLocation, setElementLocation] = useFormField(MOCK_LOCATIONS, [Validators.required]);
  const form = useFormGroup({ elementLocation });

  const onSubmit = () => propOnSubmit(form);

  return (
    <MSESelectField
      name="elementLocation"
      placeholder="ValidPath.FCA"
      options={MOCK_LOCATIONS}
      {...elementLocation}
      onChange={setElementLocation}
      label={(id) => (
        <Label for={id}>
          <CardTitle>Move datapoint to:</CardTitle>
        </Label>
      )}
    >
      {({ select, label, error }) => (
        <MSENodeEditorForm
          buttonText="Move"
          invalid={form.invalid}
          submitting={submitting}
          onSubmit={preventDefault(onSubmit)}
          label={label}
          field={
            <>
              {select}
              {error}
            </>
          }
          {...attrs}
        />
      )}
    </MSESelectField>
  );
};

MSENodeRelocationForm.propTypes = {
  node: PropTypes.object.isRequired,
  submitting: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default MSENodeRelocationForm;
