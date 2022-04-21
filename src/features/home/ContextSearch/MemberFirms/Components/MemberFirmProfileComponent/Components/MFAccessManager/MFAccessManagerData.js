import "./styles.scss";

import _ from "lodash/fp";
import React from "react";
import PropTypes from "prop-types";
import { Spinner } from "reactstrap";

import MFAccessManagerForm from "./MFAccessManagerForm";
import MFAccessManagerNoUsers from "./MFAccessManagerNoUsers";

import { useMFAccessManager } from "./useMFAccessManager";

const userToOption = (user) => ({ label: user.full_name, value: user });

const MFAccessManagerData = ({ userId, memberFirmId }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [{ data, error }, { syncBdmUsers }] = useMFAccessManager(memberFirmId, userId);

  const options = React.useMemo(() => (data ? data.potential.map(userToOption) : []), [data]);

  const onSubmit = React.useCallback(
    (submitted) => {
      const bdmUsersIds = submitted.values.bdms.map(_.get("id"));

      setIsSubmitting(true);
      syncBdmUsers({ memberFirmId, bdmUsersIds }).subscribe(() => setIsSubmitting(false));
    },
    [memberFirmId, syncBdmUsers]
  );

  if (error) {
    return <MFAccessManagerNoUsers />;
  }

  if (!data) {
    return (
      <div className="d-flex justify-content-center align-items-center pb-2">
        <Spinner />
      </div>
    );
  }

  return <MFAccessManagerForm bdms={data.active} options={options} submitting={isSubmitting} onSubmit={onSubmit} />;
};

MFAccessManagerData.propTypes = {
  memberFirmId: PropTypes.number.isRequired,
};

export default MFAccessManagerData;
