import "./styles.scss";

import _ from "lodash/fp";
import React from "react";
import PropTypes from "prop-types";
import { Spinner } from "reactstrap";

import MFAccessManagerForm from "./MFAccessManagerForm";

import { useMFAccessManager } from "./useMFAccessManager";

const MFAccessManagerData = ({ userId, memberFirmId }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [{ data, error }, { syncBdmUsers }] = useMFAccessManager(memberFirmId, userId);

  const onSubmit = React.useCallback(
    (submitted) => {
      const bdmUsersIds = submitted.values.bdms.map(_.get("id"));

      setIsSubmitting(true);
      syncBdmUsers({ memberFirmId, bdmUsersIds }).subscribe(() => setIsSubmitting(false));
    },
    [memberFirmId, syncBdmUsers]
  );

  if (error) {
    return (
      <div className="text-danger bg-dark">
        <h1>{error.name}</h1>
        <pre>{error.message}</pre>
        <pre>
          <code>{error.stack}</code>
        </pre>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="d-flex justify-content-center align-items-center pb-2">
        <Spinner />
      </div>
    );
  }

  return (
    <MFAccessManagerForm
      submitting={isSubmitting}
      activeBdmUsers={data.active}
      potentialBdmUsers={data.potential}
      onSubmit={onSubmit}
    />
  );
};

MFAccessManagerData.propTypes = {
  userId: PropTypes.number.isRequired,
  memberFirmId: PropTypes.number.isRequired,
};

export default MFAccessManagerData;
