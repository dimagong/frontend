import PropTypes from "prop-types";
import { get, pipe, isEqual } from "lodash/fp";
import React, { useMemo, useState } from "react";
import { CardTitle, Label, Row, Col } from "reactstrap";

import { useFormField, useFormGroup, Validators } from "hooks/use-form";

import DeprecatedNmpButton from "components/nmp/DeprecatedNmpButton";
import DeprecatedMSESelectField from "components/nmp/DeprecatedSelectField";

import MSEEditorForm from "features/MasterSchema/share/mse-editor-form";

const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    borderRadius: 0,
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    boxShadow: "none",
  }),
};

const MSENodeRelocationForm = ({
  node,
  multiple,
  options,
  submitting,
  label,
  action,
  onSubmit: propOnSubmit,
  note,
  ...attrs
}) => {
  const withParentNodeId = useMemo(
    () => (multiple ? () => {} : pipe(get("value.nodeId"), isEqual(node.parentNodeId))),
    [multiple, node]
  );
  const initialValue = useMemo(
    () => (multiple ? null : options.find(withParentNodeId)),
    [multiple, options, withParentNodeId]
  );
  const [pristine, setPristine] = useState(true);

  const [location, setLocation] = useFormField(initialValue, [
    Validators.required,
    Validators.identical(initialValue),
    () => !pristine,
  ]);
  const form = useFormGroup({ location });

  const onSubmit = () => propOnSubmit(form);

  const onChange = (value) => {
    setPristine(false);
    setLocation(value);
  };

  return (
    <DeprecatedMSESelectField
      {...location}
      name="location"
      options={options}
      onChange={onChange}
      menuPosition={"fixed"}
      styles={customSelectStyles}
      components={{ IndicatorSeparator: null }}
      label={(id) => (
        <Label for={id}>
          <CardTitle className="ms-manager__label">{label}</CardTitle>
        </Label>
      )}
    >
      {({ select, label, error }) => (
        <MSEEditorForm
          onSubmit={onSubmit}
          header={label}
          body={
            <Row>
              <Col xs={8}>
                {select}
                {note}
                {error}
              </Col>
              <Col xs={4}>
                <DeprecatedNmpButton className="w-100" color="primary" type="submit" disabled={form.invalid}>
                  {action}
                </DeprecatedNmpButton>
              </Col>
            </Row>
          }
          {...attrs}
        />
      )}
    </DeprecatedMSESelectField>
  );
};

MSENodeRelocationForm.defaultProps = {
  multiple: false,
  submitting: false,
};

MSENodeRelocationForm.propTypes = {
  node: PropTypes.object,
  multiple: PropTypes.bool,
  options: PropTypes.array.isRequired,
  submitting: PropTypes.bool,
  label: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default MSENodeRelocationForm;
