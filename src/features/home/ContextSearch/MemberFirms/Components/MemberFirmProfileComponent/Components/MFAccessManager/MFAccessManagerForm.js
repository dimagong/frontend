import _ from "lodash/fp";
import React from "react";
import PropTypes from "prop-types";
import { Label, Row } from "reactstrap";

import { preventDefault } from "utility/event-decorators";
import { useFormGroup, useFormField, Validators } from "hooks/use-form";

import NmpButton from "components/nmp/NmpButton";
import NmpTilesSelectField from "components/nmp/NmpTilesSelectField";

const MFAccessManagerForm = ({ activeBdmUsers, potentialBdmUsers, submitting, onSubmit: propOnSubmit }) => {
  const [user, setUser] = React.useState(null);
  const [bdmsField, setBdms] = useFormField(activeBdmUsers, [Validators.required, Validators.identical(activeBdmUsers)]);

  const formGroup = useFormGroup({ bdms: bdmsField });

  const options = React.useMemo(() => {
    const options = potentialBdmUsers.map((user) => ({ label: user.full_name, value: user }));
    const notAddedOptions = options.filter(({ value: user }) => !bdmsField.value.includes(user.full_name));

    return notAddedOptions;
  }, [potentialBdmUsers, bdmsField.value]);

  const bdmUsersNames = React.useMemo(() => bdmsField.value.map(_.get("full_name")), [bdmsField.value]);

  const onUsersAdding = React.useCallback((bdm) => setBdms((prev) => [...prev, bdm]), [setBdms]);

  const onUsersRemoving = React.useCallback(
    (toRemove) => setBdms((prev) => prev.filter(({ id }) => id !== toRemove.id)),
    [setBdms]
  );

  const onSubmit = React.useCallback(() => propOnSubmit(formGroup), [formGroup, propOnSubmit]);

  return (
    <form className="pb-2" onSubmit={preventDefault(onSubmit)}>
      <NmpTilesSelectField
        name="bdm"
        value={user}
        options={options}
        onChange={setUser}
        tileColor="primary"
        tiles={bdmUsersNames}
        onTileAdd={onUsersAdding}
        onTileRemove={onUsersRemoving}
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
  activeBdmUsers: PropTypes.arrayOf(PropTypes.object).isRequired,
  potentialBdmUsers: PropTypes.arrayOf(PropTypes.object).isRequired,

  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default MFAccessManagerForm;
