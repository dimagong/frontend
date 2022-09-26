import React from "react";
import PropTypes from "prop-types";

import { IdType } from "utility/prop-types";
import { useOrganizationLogoQuery } from "api/file/useOrganizationFileQueries";

import DeprecatedNmpImage from "../DeprecatedNmpImage";

const DeprecatedNmpOrganizationLogo = (props) => {
  const { fileId, isOnboarding, organizationId, organizationType, organizationName, ...attrs } = props;

  const logoQuery = useOrganizationLogoQuery(
    { organizationId, organizationType, isOnboarding },
    { enabled: Boolean(fileId) }
  );

  return (
    <DeprecatedNmpImage src={logoQuery.data.url} alt={organizationName} isLoading={logoQuery.isLoading} {...attrs} />
  );
};

DeprecatedNmpOrganizationLogo.propTypes = {
  fileId: IdType,
  organizationId: IdType.isRequired,
  organizationType: PropTypes.string.isRequired,
  organizationName: PropTypes.string.isRequired,
};

export default DeprecatedNmpOrganizationLogo;
