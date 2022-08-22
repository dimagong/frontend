import React, { useState } from "react";

import { useDFormContext } from "components/DForm/DFormContext";

import { useCreateMVAUserFilesMutation } from "api/Onboarding/prospectUserQuery";
import { useCreateApplicationUserFilesMutation } from "features/user-managment/userEdit/userQueries";

import File from "./File";
import { MemberFilePreview } from "./MemberFilePreview";
import { ManagerFilePreview } from "./ManagerFilePreview";

const FileWidget = (props) => {
  const { isRequired, disabled, label, value, masterSchemaPropertyId: masterSchemaFieldId } = props;
  const isDisabled = Boolean(disabled);

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
    onSuccess: () => setUploadingFiles([]),
  });

  const onChange = (files) => {
    files = Array.from(files);
    const formData = new FormData();

    formData.append("master_schema_field_id", props.masterSchemaPropertyId);

    const uploadingFiles = [];
    files.forEach((file, idx) => {
      uploadingFiles.push({ name: file.name });
      formData.append(`files[${idx}]`, file, file.name);
    });

    setUploadingFiles(uploadingFiles);
    createUserFilesMutation.mutate(formData);
  };

  return (
    <File
      label={label}
      value={value}
      onChange={onChange}
      isMultiple={false}
      isDisabled={isDisabled}
      isRequired={isRequired}
      isLoading={createUserFilesMutation.isLoading}
      uploadingFiles={uploadingFiles}
      // In next update it will be refactored with DI as Network API provider which will provide
      // an clientHttpAPI service that is abstraction for any implementation. So, in case when FilePreview
      // is used in member view scope it will use the service that implements an clientHttpAPI, and in case
      // when it is used in another scope that provide Network it will use it correspondingly.
      previewFile={({ name, file_id }) => {
        return isMemberView ? (
          <MemberFilePreview name={name} fileId={file_id} masterSchemaFieldId={masterSchemaFieldId} key={file_id} />
        ) : (
          <ManagerFilePreview name={name} fileId={file_id} masterSchemaFieldId={masterSchemaFieldId} key={file_id} />
        );
      }}
    />
  );
};

export default FileWidget;
