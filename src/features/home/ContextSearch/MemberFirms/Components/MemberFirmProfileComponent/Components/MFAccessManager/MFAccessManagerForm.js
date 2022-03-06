import React from "react";
import PropTypes from "prop-types";
import { Label, Row } from "reactstrap";

import { useFormGroup, useFormField, Validators } from "hooks/use-form";

import NmpButton from "components/nmp/NmpButton";
import NmpTilesSelectField from "components/nmp/NmpTilesSelectField";

const MFAccessManagerForm = ({ users, submitting, onSubmit: propOnSubmit }) => {
  const [user, setUser] = React.useState(null);
  const [usersField, setUsersField] = useFormField([], [Validators.required]);
  const formGroup = useFormGroup({ usersField });

  const options = React.useMemo(() => {
    const options = users.map((user) => ({ label: `${user.first_name} ${user.last_name}`, value: user }));
    const notAddedOptions = options.filter(({ value: user }) => !usersField.value.includes(user.name));

    return notAddedOptions;
  }, [users, usersField.value]);

  const onUsersAdding = React.useCallback(({ name }) => setUsersField((prev) => [...prev, name]), [setUsersField]);

  const onUsersRemoving = React.useCallback(
    (toRemove) => setUsersField((prev) => prev.filter((name) => name !== toRemove.name)),
    [setUsersField]
  );

  const onSubmit = React.useCallback(() => propOnSubmit(formGroup), [formGroup, propOnSubmit]);

  return (
    <form className="pb-2" onSubmit={onSubmit}>
      <NmpTilesSelectField
        name="bdm"
        value={user}
        options={options}
        onChange={setUser}
        tileColor="primary"
        tiles={usersField.value}
        onTileAdd={onUsersAdding}
        onTileRemove={onUsersRemoving}
        errors={usersField.errors}
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
  users: PropTypes.arrayOf(PropTypes.object).isRequired,

  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default MFAccessManagerForm;
