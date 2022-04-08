import _ from "lodash/fp";
import React from "react";
import PropTypes from "prop-types";
import { Label, Row } from "reactstrap";

import { preventDefault } from "utility/event-decorators";
import { useFormGroup, useFormField, Validators } from "hooks/use-form";

import NmpButton from "components/nmp/NmpButton";
import NmpTilesSelectField from "components/nmp/NmpTilesSelectField";

const bdmToOption = (bdm) => ({ label: bdm.full_name, value: bdm });

const MFAccessManagerForm = ({ bdms, options, submitting, onSubmit: propOnSubmit }) => {
  const [bdmsField, setBdmsField] = useFormField(bdms, [Validators.identicalArrayBy(bdms, "id")]);
  const formGroup = useFormGroup({ bdms: bdmsField });

  const tiles = React.useMemo(() => bdmsField.value.map(bdmToOption), [bdmsField.value]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onChange = React.useCallback((newTiles) => setBdmsField(newTiles.map(_.get("value"))), []);

  const onSubmit = React.useCallback(() => propOnSubmit(formGroup), [formGroup, propOnSubmit]);

  return (
    <form className="pb-2" onSubmit={preventDefault(onSubmit)}>
      <NmpTilesSelectField
        name="bdm"
        value={tiles}
        options={options}
        onChange={onChange}
        errors={bdmsField.errors}
        tileColor="primary"
        label={(id) => (
          <Label className="member-firm-role__label" for={id}>
            Managing BDM(s)
          </Label>
        )}
      />

      <Row className="mt-4" noGutters>
        <NmpButton className="ml-auto" color="primary" disabled={formGroup.invalid} loading={submitting}>
          Save
        </NmpButton>
      </Row>
    </form>
  );
};

MFAccessManagerForm.propTypes = {
  bdms: PropTypes.arrayOf(PropTypes.object).isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  submitting: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default MFAccessManagerForm;
