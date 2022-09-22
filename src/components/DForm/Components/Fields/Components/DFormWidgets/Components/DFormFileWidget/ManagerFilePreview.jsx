import React from "react";
import PropTypes from "prop-types";

import { IdType } from "utility/prop-types";

import { useDFormContext } from "components/DForm/DFormContext";

import {
  useApplicationUserFileQuery,
  useDeleteApplicationUserFileMutation,
} from "features/user-managment/userEdit/userQueries";

import { FilePreview } from "./FilePreview";

export const ManagerFilePreview = (props) => {
  const { fileId, name, masterSchemaFieldId, isUploading = false, isRemovable = true, onRemove: propOnRemove } = props;

  const { dFormId } = useDFormContext();

  const params = { dFormId, masterSchemaFieldId, fileId };
  // In next update it will be refactored with DI as Network API provider which will provide
  // an clientHttpAPI service that is abstraction for any implementation. So, in case when FilePreview
  // is used in member view scope it will use the service that implements an clientHttpAPI, and in case
  // when it is used in another scope that provide Network it will use it correspondingly.
  const fileQuery = useApplicationUserFileQuery(params, { enabled: Boolean(fileId) && Boolean(masterSchemaFieldId) });
  const removeFileMutation = useDeleteApplicationUserFileMutation(params, { onSuccess: () => propOnRemove(fileId) });

  const onRemove = () => {
    if (!window.confirm("Are you sure you want to remove the file ?")) {
      return;
    }

    removeFileMutation.mutate({ master_schema_field_id: masterSchemaFieldId, file_id: fileId });
  };

  const onDownload = () => {};

  return (
    <FilePreview
      name={name}
      file={fileQuery.data.file}
      isRemoving={removeFileMutation.isLoading}
      isRemovable={isRemovable}
      isUploading={isUploading}
      isDownloading={fileQuery.isLoading}
      onRemove={onRemove}
      onDownload={onDownload}
    />
  );
};

ManagerFilePreview.propTypes = {
  fileId: IdType,
  name: PropTypes.string.isRequired,
  masterSchemaFieldId: IdType,
  isRemovable: PropTypes.bool,
  isUploading: PropTypes.bool,
  onRemove: PropTypes.func,
};
