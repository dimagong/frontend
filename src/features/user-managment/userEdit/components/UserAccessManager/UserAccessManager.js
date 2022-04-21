import React from "react";
import PropTypes from "prop-types";

import UserAccessManagerSelect from "./UserAccessManagerSelect";
import UserAccessManagerNoUsers from "./UserAccessManagerNoUsers";

const userToOption = (user) => ({ label: user.full_name, value: user });

const UserAccessManager = ({ active = [], potential = [], error, errors, onChange }) => {
  const options = React.useMemo(() => (potential.map(userToOption)), [potential]);

  if (error) {
    return <UserAccessManagerNoUsers />;
  }

  return <UserAccessManagerSelect bdms={active} options={options} onChange={onChange} errors={errors} />;
};

UserAccessManager.propTypes = {
  error: PropTypes.any,
  active: PropTypes.arrayOf(PropTypes.object),
  potential: PropTypes.arrayOf(PropTypes.object),
  errors: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
};

export default UserAccessManager;
