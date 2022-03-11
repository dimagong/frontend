import React from "react";
import PropTypes from "prop-types";
import { Label, Row } from "reactstrap";

import { preventDefault } from "utility/event-decorators";
import { useFormGroup, useFormField, Validators } from "hooks/use-form";

import NmpButton from "components/nmp/NmpButton";
import NmpTilesSelectField from "components/nmp/NmpTilesSelectField";

const bdmToTile = ({ id, full_name }) => ({ id, label: full_name });

const MFAccessManagerForm = ({ bdms, options, submitting, onSubmit: propOnSubmit }) => {
  const [selected, setSelected] = React.useState(null);
  const [bdmsField, setBdmsField] = useFormField(bdms, [Validators.identicalArrayBy(bdms, "id")]);
  const formGroup = useFormGroup({ bdms: bdmsField });

  const optionsWithoutBdms = React.useMemo(() => {
    return options.filter(({ value }) => !bdmsField.value.find((bdm) => bdm.id === value.id));
  }, [bdmsField.value, options]);

  const tiles = React.useMemo(() => bdmsField.value.map(bdmToTile), [bdmsField.value]);

  const onBdmsAdding = React.useCallback((bdm) => {
    setBdmsField((prev) => [...prev, bdm]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onBdmsRemoving = React.useCallback(
    (toRemove) => {
      setBdmsField((prev) => prev.filter(({ id }) => id !== toRemove.id));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onSubmit = React.useCallback(() => propOnSubmit(formGroup), [formGroup, propOnSubmit]);

  return (
    <form className="pb-2" onSubmit={preventDefault(onSubmit)}>
      <NmpTilesSelectField
        name="bdm"
        value={selected}
        options={optionsWithoutBdms}
        onChange={setSelected}
        tileColor="primary"
        tiles={tiles}
        onTileAdd={onBdmsAdding}
        onTileRemove={onBdmsRemoving}
        errors={bdmsField.errors}
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
