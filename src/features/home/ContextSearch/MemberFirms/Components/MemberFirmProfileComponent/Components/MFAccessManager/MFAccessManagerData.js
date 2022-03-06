import "./styles.scss";

import _ from "lodash/fp";
import React from "react";
import PropTypes from "prop-types";
import { Spinner } from "reactstrap";

import MFAccessManagerForm from "./MFAccessManagerForm";
import MFAccessManagerNoUsers from "./MFAccessManagerNoUsers";

import { useMFAccessManager } from "./useMFAccessManager";

const MFAccessManagerData = ({ memberFirmId }) => {
  const { data: users, loading } = useMFAccessManager(memberFirmId);

  const onSubmit = React.useCallback(() => {}, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <Spinner />
      </div>
    );
  }

  if (_.isEmpty(users)) {
    return <MFAccessManagerNoUsers />;
  }

  return <MFAccessManagerForm onSubmit={onSubmit} submitting={false} users={users} />;
};

MFAccessManagerData.propTypes = {
  memberFirmId: PropTypes.number.isRequired,
};

export default MFAccessManagerData;
