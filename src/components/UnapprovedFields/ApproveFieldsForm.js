import React from "react";
import PropTypes from "prop-types";
import { CardSubtitle, CardTitle, Col, Label, Row } from "reactstrap";

import { useFormField, useFormGroup, Validators } from "hooks/use-form";

import NmpButton from "components/nmp/NmpButton";
import SelectField from "components/nmp/SelectField";

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

const ApproveFieldsForm = ({ selectedIds, isSubmitting, locationOptions, onApprove }) => {
  const [location, setLocation] = useFormField(null, [Validators.required]);
  const form = useFormGroup({ location });

  const onSubmit = React.useCallback(() => {
    const parentId = form.values.location.value.id;
    const payload = { parentId };

    onApprove(payload);
  }, [form, onApprove]);

  // clear select value depends on fields selecting
  React.useEffect(() => void setLocation(null), [setLocation]);

  return (
    <SelectField
      name="elementLocation"
      placeholder="Choose location"
      options={locationOptions}
      onChange={setLocation}
      styles={customSelectStyles}
      components={{ IndicatorSeparator: null }}
      label={(id) => (
        <Label for={id} className="approve__label">
          <CardTitle className="approve__title font-weight-bold">Approve selected fields</CardTitle>
          <CardSubtitle className="approve__subtitle mt-1">
            Which branch should the selected {selectedIds.length} element
            {selectedIds.length === 1 ? "" : "s"} be approved into?
          </CardSubtitle>
        </Label>
      )}
    >
      {({ select, error, label }) => (
        <MSEEditorForm
          onSubmit={onSubmit}
          header={label}
          body={
            <Row>
              <Col xs={12}>
                {select}
                {error}
              </Col>
              <Col xs={12} className="d-flex mt-3">
                <NmpButton
                  className="ml-auto"
                  color="primary"
                  type="submit"
                  loading={isSubmitting}
                  disabled={form.invalid}
                >
                  Approve and move
                </NmpButton>
              </Col>
            </Row>
          }
        />
      )}
    </SelectField>
  );
};

ApproveFieldsForm.propTypes = {
  isSubmitting: PropTypes.bool.isRequired,
  locationOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedIds: PropTypes.arrayOf(PropTypes.string).isRequired,

  onApprove: PropTypes.func.isRequired,
};

export default ApproveFieldsForm;
