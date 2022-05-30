import moment from "moment";
import React, { useMemo } from "react";

import { useRMFields } from "api/resourceManager/useRMFields";

import { CustomSelect } from "./Parts/CustomSelect";

const getLabel = (file) => {
  return `ResourceManager.${file.breadcrumbs}.${file.name}`;
};

const getOption = (file) => ({ label: getLabel(file), value: file.id });

const mapToOptions = (files) => files.map(getOption);

const findSelectedValue = (options, resourceManagerFieldId) => {
  return options.filter((option) => option.value === resourceManagerFieldId);
};

const ResourceManagerFieldFiles = ({ organizations, resourceManagerFieldId, onChange }) => {
  const { data: fileOptions = [] } = useRMFields(
    { organizationId: organizations[0]?.id, organizationType: organizations[0]?.type },
    { select: mapToOptions }
  );

  const value = useMemo(
    () => findSelectedValue(fileOptions, resourceManagerFieldId),
    [fileOptions, resourceManagerFieldId]
  );

  return (
    <CustomSelect id="select-ms-property" options={fileOptions} value={value} onChange={onChange} invalid={false} />
  );
};

export default ResourceManagerFieldFiles;
