import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { CardTitle, Label } from "reactstrap";
import { get, pipe, isEqual } from "lodash/fp";

import { preventDefault } from "utility/event-decorators";
import { useFormField, useFormGroup, Validators } from "hooks/use-form";

import MSESelectField from "features/MasterSchema/share/mse-select-field";
import { selectMasterSchemaOfSelectedOrganization } from "app/selectors/masterSchemaSelectors";

import MSENodeEditorForm from "./mse-node-editor-form";

const nodeToOption = (node) => ({ label: node.path.join("."), value: node });

const MSENodeRelocationForm = ({ node, submitting, onSubmit: propOnSubmit, ...attrs }) => {
  const { root } = useSelector(selectMasterSchemaOfSelectedOrganization);
  const withParentKey = useMemo(() => pipe(get("value.key"), isEqual(node.parentKey)), [node]);
  const locationOptions = useMemo(() => [root, ...root.children].filter(get("containable")).map(nodeToOption), [root]);
  const initialValue = useMemo(() => locationOptions.find(withParentKey), [locationOptions, withParentKey]);
  const [location, setLocation] = useFormField(initialValue, [Validators.required, Validators.identical(initialValue)]);
  const form = useFormGroup({ location });

  const onSubmit = () => propOnSubmit(form);

  return (
    <MSESelectField
      name="elementLocation"
      placeholder="ValidPath.FCA"
      options={locationOptions}
      {...location}
      onChange={setLocation}
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
