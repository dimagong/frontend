import "./styles.scss";

import PropTypes from "prop-types";
import React, { useMemo } from "react";

import ContextFeatureTemplate from "components/ContextFeatureTemplate";

const RMContextFeatureTemplate = ({ field, children }) => {
  const fieldLocation = useMemo(() => field.path.join(" / "), [field]);

  return (
    <ContextFeatureTemplate contextFeatureTitle="File information">
      <p className="font-medium-5" style={{ marginTop: -20 }}>
        {fieldLocation}
      </p>

      {children}
    </ContextFeatureTemplate>
  );
};

RMContextFeatureTemplate.propTypes = {
  field: PropTypes.object.isRequired,
};

export default RMContextFeatureTemplate;
