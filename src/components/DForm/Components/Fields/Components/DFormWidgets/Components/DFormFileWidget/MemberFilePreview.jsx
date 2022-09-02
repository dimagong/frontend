import React from "react";
import PropTypes from "prop-types";

import { IdType } from "utility/prop-types";

import { useDFormContext } from "components/DForm/DFormContext";

import { useDeleteMVAUserFileMutation, useMVAUserFileQuery } from "api/Onboarding/prospectUserQuery";

import { FilePreview } from "./FilePreview";

export const MemberFilePreview = ({ fileId, name, masterSchemaFieldId, isUploading = false, isRemovable = true }) => {
  const { dFormId } = useDFormContext();

  const params = { dFormId, masterSchemaFieldId, fileId };
  // In next update it will be refactored with DI as Network API provider which will provide
  // an clientHttpAPI service that is abstraction for any implementation. So, in case when FilePreview
  // is used in member view scope it will use the service that implements an clientHttpAPI, and in case
  // when it is used in another scope that provide Network it will use it correspondingly.
  const fileQuery = useMVAUserFileQuery(params, { enabled: Boolean(fileId) });
  const removeFileMutation = useDeleteMVAUserFileMutation(params);

  const onRemove = () => {
    if (!window.confirm("Are you sure you want to remove the file ?")) {
      return;
    }

    removeFileMutation.mutate({ master_schema_field_id: masterSchemaFieldId, file_id: fileId });
  };

  return (
    <FilePreview
      name={name}
      file={fileQuery.data.file}
      isRemoving={removeFileMutation.isLoading}
      isRemovable={isRemovable}
      isUploading={isUploading}
      isDownloading={fileQuery.isLoading}
      onRemove={onRemove}
    />
  );
};

MemberFilePreview.propTypes = {
  fileId: IdType,
  name: PropTypes.string.isRequired,
  masterSchemaFieldId: IdType.isRequired,
  isRemovable: PropTypes.bool,
  isUploading: PropTypes.bool,
};
