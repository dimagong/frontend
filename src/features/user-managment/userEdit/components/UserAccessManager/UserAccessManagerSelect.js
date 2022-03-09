import React from "react";
import PropTypes from "prop-types";
import { Label } from "reactstrap";

import NmpTilesSelectField from "components/nmp/NmpTilesSelectField";

const bdmToTile = ({ id, full_name }) => ({ id, label: full_name });

const UserAccessManagerSelect = ({ bdms, options, errors = [], onChange }) => {
  const [selected, setSelected] = React.useState(null);

  const optionsWithoutBdms = React.useMemo(() => {
    return options.filter(({ value }) => !bdms.find((bdm) => bdm.id === value.id));
  }, [bdms, options]);

  const tiles = React.useMemo(() => bdms.map(bdmToTile), [bdms]);

  const onBdmsAdding = React.useCallback((bdm) => {
    onChange((prev) => [...prev, bdm]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onBdmsRemoving = React.useCallback(
    (toRemove) => {
      onChange((prev) => prev.filter(({ id }) => id !== toRemove.id));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <NmpTilesSelectField
      name="bdm"
      value={selected}
      options={optionsWithoutBdms}
      onChange={setSelected}
      tileColor="primary"
      tiles={tiles}
      onTileAdd={onBdmsAdding}
      onTileRemove={onBdmsRemoving}
      errors={errors}
      label={(id) => <Label for={id}>Managing BDM(s)</Label>}
    />
  );
};

UserAccessManagerSelect.propTypes = {
  bdms: PropTypes.arrayOf(PropTypes.object).isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(PropTypes.string),
};

export default UserAccessManagerSelect;
