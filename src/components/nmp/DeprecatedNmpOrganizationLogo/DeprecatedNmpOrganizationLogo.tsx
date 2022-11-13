import React from "react";
import type { FC } from "react";

import { useOrganizationLogoQuery } from "api/file/useOrganizationFileQueries";

import DeprecatedNmpImage from "../DeprecatedNmpImage";

type Props = {
  fileId?: number;
  isOnboarding: boolean;
  organizationId: number;
  organizationType: string;
  organizationName: string;
  className?: string;
};

const DeprecatedNmpOrganizationLogo: FC<Props> = (props) => {
  const { fileId, isOnboarding, organizationId, organizationType, organizationName, className } = props;

  const logoQuery = useOrganizationLogoQuery(
    { organizationId, organizationType, isOnboarding },
    { enabled: Boolean(fileId) }
  );

  return (
    <DeprecatedNmpImage
      src={logoQuery.data.url}
      alt={organizationName}
      isLoading={logoQuery.isLoading}
      className={className}
    />
  );
};

export default DeprecatedNmpOrganizationLogo;
