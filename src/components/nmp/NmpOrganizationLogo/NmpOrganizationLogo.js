import React from "react";
import PropTypes from "prop-types";

import { IdType } from "utility/prop-types";
import { useOrganizationLogoQuery } from "api/file/useOrganizationFileQueries";

import NmpImage from "../NmpImage";

const NmpOrganizationLogo = ({ fileId, organizationId, organizationType, organizationName, ...attrs }) => {
  const logoQuery = useOrganizationLogoQuery({ organizationId, organizationType }, { enabled: Boolean(fileId) });

  return <NmpImage src={logoQuery.data.url} alt={organizationName} isLoading={logoQuery.isLoading} {...attrs} />;
};

NmpOrganizationLogo.propTypes = {
  fileId: IdType,
  organizationId: IdType.isRequired,
  organizationType: PropTypes.string.isRequired,
  organizationName: PropTypes.string.isRequired,
};

export default NmpOrganizationLogo;
