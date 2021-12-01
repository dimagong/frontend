import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { get, pipe, isEqual } from "lodash/fp";
import { CardTitle, Label, Row, Col } from "reactstrap";

import { useFormField, useFormGroup, Validators } from "hooks/use-form";

import MSEButton from 'features/MasterSchema/share/mse-button';
import MSEEditorForm from "features/MasterSchema/share/mse-editor-form";
import MSESelectField from "features/MasterSchema/share/mse-select-field";

const MSENodeRelocationForm = ({ node, options, submitting, onSubmit: propOnSubmit, ...attrs }) => {
  const withParentKey = useMemo(() => pipe(get("value.key"), isEqual(node.parentKey)), [node]);
  const initialValue = useMemo(() => options.find(withParentKey), [options, withParentKey]);

  const [location, setLocation] = useFormField(initialValue, [Validators.required, Validators.identical(initialValue)]);
  const form = useFormGroup({ location });

  const onSubmit = () => propOnSubmit(form);

  return (
    <MSESelectField
      {...location}
      name="location"
      options={options}
      onChange={setLocation}
      menuPosition={"fixed"}
      label={(id) => (
        <Label for={id}>
          <CardTitle>Move datapoint to:</CardTitle>
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
                {error}
              </Col>
              <Col xs={4}>
                <MSEButton
                  className="w-100"
                  textColor="#fff"
                  backgroundColor="#ABABAB4D"
                  type="submit"
                  disabled={form.invalid}
                >
                  Move
                </MSEButton>
              </Col>
            </Row>
          }
          {...attrs}
        />
      )}
    </MSESelectField>
  );
};

MSENodeRelocationForm.defaultProps = {
  submitting: false,
};

MSENodeRelocationForm.propTypes = {
  node: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
  submitting: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
};

export default MSENodeRelocationForm;
