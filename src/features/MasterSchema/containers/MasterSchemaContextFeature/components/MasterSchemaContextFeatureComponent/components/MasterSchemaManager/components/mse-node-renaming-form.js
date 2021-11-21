import PropTypes from "prop-types";
import { CardTitle, Label } from "reactstrap";
import { pipe, isEqual, get } from "lodash/fp";
import React, { useCallback, useMemo } from "react";

import { preventDefault } from "utility/event-decorators";
import MSETextField from "features/MasterSchema/share/mse-text-field";
import { useFormField, useFormGroup, Validators } from "hooks/use-form";

import MSENodeEditorForm from "./mse-node-editor-form";

const MOCK_NODE = { id: "1", name: "ValidPath.FCA.InvestmentBusiness" };
const MOCK_NODES = [MOCK_NODE];

const MSENodeRenamingForm = ({ nodeId, submitting, onSubmit: propOnSubmit, ...attrs }) => {
  const equalsToId = useCallback(pipe(get("id"), isEqual(nodeId)), [nodeId]);
  const node = useMemo(() => MOCK_NODES.find(equalsToId), [equalsToId]);

  // Form implementation
  const [elementName, setElementName] = useFormField(node.name, [Validators.required]);
  const form = useFormGroup({ elementName });

  const onSubmit = () => propOnSubmit(form);

  return (
    <MSETextField
      name="elementName"
      onChange={({ target }) => setElementName(target.value)}
      {...elementName}
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
  nodeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  submitting: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default MSENodeRenamingForm;
