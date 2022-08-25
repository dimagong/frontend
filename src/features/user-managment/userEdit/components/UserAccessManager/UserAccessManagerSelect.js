import _ from "lodash/fp";
import React from "react";
import PropTypes from "prop-types";
import { Label } from "reactstrap";

import DeprecatedNmpTilesSelectField from "components/nmp/DeprecatedNmpTilesSelectField";

const bdmToOption = (bdm) => ({ label: bdm.full_name, value: bdm });

const UserAccessManagerSelect = ({ bdms, options, errors = [], onChange: propOnChange }) => {
  const tiles = React.useMemo(() => bdms.map(bdmToOption), [bdms]);

  const onChange = React.useCallback((newBdms) => propOnChange(newBdms.map(_.get("value"))), [propOnChange]);

  return (
    <DeprecatedNmpTilesSelectField
      name="bdm"
      value={tiles}
      options={options}
      onChange={onChange}
      errors={errors}
      tileColor="primary"
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
