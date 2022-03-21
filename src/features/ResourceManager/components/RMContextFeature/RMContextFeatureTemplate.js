import "./styles.scss";

import React, { useMemo } from "react";
import PropTypes from "prop-types";

import ContextFeatureTemplate from "components/ContextFeatureTemplate";

const RMContextFeatureTemplate = ({ field, children }) => {
  const fieldLocation = useMemo(() => field.path.join(" / "), [field]);

  return (
    <ContextFeatureTemplate contextFeatureTitle="File information">
      <strong className="d-block font-size-large" style={{ marginTop: -20 }}>
        {fieldLocation}
      </strong>

      {children}
    </ContextFeatureTemplate>
  );
};

RMContextFeatureTemplate.propTypes = {
  field: PropTypes.object.isRequired,
};

export default RMContextFeatureTemplate;
