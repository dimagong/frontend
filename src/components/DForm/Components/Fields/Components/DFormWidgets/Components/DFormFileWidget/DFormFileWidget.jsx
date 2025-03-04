import PropTypes from "prop-types";
import React, { useState } from "react";

import { IdType } from "utility/prop-types";

import { useDFormContext } from "components/DForm/DFormContext";

import { useCreateMVAUserFilesMutation } from "./fileQueries";
import { useCreateApplicationUserFilesMutation } from "./fileQueries";

import { File } from "./File";
import { MemberFilePreview } from "./MemberFilePreview";
import { ManagerFilePreview } from "./ManagerFilePreview";

import { DFormFieldContainer } from "../DFormFieldContainer";

export const DFormFileWidget = (props) => {
  const {
    id,
    value = [],
    label,
    error,
    isError,
    isRequired,
    isDisabled,
    isLabelShowing,
    masterSchemaFieldId,
    onChange: propOnChange,
    className,
  } = props;

  const { dFormId, isMemberView } = useDFormContext();

  const [uploadingFiles, setUploadingFiles] = useState([]);
  // In next update it will be refactored with DI as Network API provider which will provide
  // an clientHttpAPI service that is abstraction for any implementation. So, in case when FilePreview
  // is used in member view scope it will use the service that implements an clientHttpAPI, and in case
  // when it is used in another scope that provide Network it will use it correspondingly.
  const useCreateUserFilesMutation = isMemberView
    ? useCreateMVAUserFilesMutation
    : useCreateApplicationUserFilesMutation;
  const params = { dFormId, masterSchemaFieldId };
  const createUserFilesMutation = useCreateUserFilesMutation(params, {
    onError: () => setUploadingFiles([]),
    onSuccess: (files) => {
      propOnChange(files);
      setUploadingFiles([]);
    },
  });

  const onChange = (files) => {
    files = Array.from(files);
    const formData = new FormData();

    formData.append("master_schema_field_id", masterSchemaFieldId);

    const uploadingFiles = [];
    files.forEach((file, idx) => {
      uploadingFiles.push({ name: file.name });
      formData.append(`files[${idx}]`, file, file.name);
    });

    setUploadingFiles(uploadingFiles);
    createUserFilesMutation.mutate(formData);
  };

  const onRemove = (removedId) => {
    propOnChange(value.filter(({ file_id }) => file_id !== removedId));
  };

  return (
    <DFormFieldContainer
      id={id}
      error={error}
      label={label}
      isError={isError}
      isRequired={isRequired}
      isLabelShowing={isLabelShowing}
      className={className}
    >
      <File
        id={id}
        label={label}
        value={value}
        onChange={onChange}
        isDisabled={isDisabled}
        isLoading={createUserFilesMutation.isLoading}
        uploadingFiles={uploadingFiles}
        // In next update it will be refactored with DI as Network API provider which will provide
        // an clientHttpAPI service that is abstraction for any implementation. So, in case when FilePreview
        // is used in member view scope it will use the service that implements an clientHttpAPI, and in case
        // when it is used in another scope that provide Network it will use it correspondingly.
        previewFile={({ name, file_id }, index) => {
          return isMemberView ? (
            <MemberFilePreview
              name={name}
              fileId={file_id}
              masterSchemaFieldId={masterSchemaFieldId}
              onRemove={onRemove}
              key={file_id ?? `file-preview-${index}`}
            />
          ) : (
            <ManagerFilePreview
              name={name}
              fileId={file_id}
              masterSchemaFieldId={masterSchemaFieldId}
              onRemove={onRemove}
              key={file_id ?? `file-preview-${index}`}
            />
          );
        }}
      />
    </DFormFieldContainer>
  );
};

DFormFileWidget.propTypes = {
  id: IdType.isRequired,
  value: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired, file_id: IdType })),
  label: PropTypes.string,
  error: PropTypes.string,
  isError: PropTypes.bool.isRequired,
  isRequired: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  isLabelShowing: PropTypes.bool.isRequired,
  masterSchemaFieldId: IdType,
  onChange: PropTypes.func,
};
