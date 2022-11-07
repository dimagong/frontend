import PropTypes from "prop-types";
import React, { useReducer } from "react";

import { IdType } from "utility/prop-types";

import { useDFormContext } from "components/DForm/DFormContext";

import { useDeleteMVAUserFileMutation, useMVAUserFileQuery } from "./fileQueries";

import { FilePreview } from "./FilePreview";

const downloadFile = (file) => {
  const url = URL.createObjectURL(file);
  const anchorElement = document.createElement("a");

  anchorElement.href = url;
  anchorElement.setAttribute("target", "_blank");
  anchorElement.setAttribute("download", file.name);

  anchorElement.click();
  URL.revokeObjectURL(url);
};

export const MemberFilePreview = (props) => {
  const {
    name,
    fileId,
    masterSchemaFieldId,

    isUploading = false,
    isRemovable = true,

    onRemove: propOnRemove,
  } = props;

  const { dFormId } = useDFormContext();
  const [download, toggleDownload] = useReducer(() => true, false);

  // In next update it will be refactored with DI as Network API provider which will provide
  // an clientHttpAPI service that is abstraction for any implementation. So, in case when FilePreview
  // is used in member view scope it will use the service that implements an clientHttpAPI, and in case
  // when it is used in another scope that provide Network it will use it correspondingly.
  const params = { dFormId, masterSchemaFieldId, fileId };

  const fileQuery = useMVAUserFileQuery(params, {
    enabled: download && Boolean(fileId) && Boolean(masterSchemaFieldId),
    onSuccess: ({ file }) => {
      if (!fileQuery.data.file) {
        downloadFile(file);
      }
    },
  });
  const removeFileMutation = useDeleteMVAUserFileMutation(params, { onSuccess: () => propOnRemove(fileId) });

  const onRemove = () => {
    if (!window.confirm("Are you sure you want to remove the file ?")) {
      return;
    }

    removeFileMutation.mutate({ master_schema_field_id: masterSchemaFieldId, file_id: fileId });
  };

  const onDownload = () => {
    toggleDownload();

    if (fileQuery.data.file) {
      downloadFile(fileQuery.data.file);
    }
  };

  return (
    <FilePreview
      name={name}
      isRemovable={isRemovable}
      isRemoving={removeFileMutation.isLoading}
      isUploading={isUploading}
      isDownloading={fileQuery.isLoading}
      onRemove={onRemove}
      onDownload={onDownload}
    />
  );
};

MemberFilePreview.propTypes = {
  name: PropTypes.string.isRequired,
  fileId: IdType,
  masterSchemaFieldId: IdType,

  isRemovable: PropTypes.bool,
  isUploading: PropTypes.bool,

  onRemove: PropTypes.func,
  onDownload: PropTypes.func,
};
