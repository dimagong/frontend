import moment from "moment";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import React, { useEffect, useMemo, useState } from "react";

import { IdType } from "utility/prop-types";
import { preventDefault } from "utility/event-decorators";

import { useFormField, useFormGroup, Validators } from "hooks/use-form";

import DeprecatedNmpSelect from "components/nmp/DeprecatedNmpSelect";
import DeprecatedNmpButton from "components/nmp/DeprecatedNmpButton";

import { useUserMSResourceFields } from "api/User/useUserMSResourceFields";
import { useDownloadRMFile, useEditRMFile } from "api/resourceManager/useRMFieldFiles";
import { useOpenRMFileReferencesPreview } from "api/resourceManager/useRMFieldFileReferences";
import { useDeleteUserRMFile, useFinishUserRMFile, useUserRMFieldFiles } from "api/User/useUserRMFieldFiles";

import RMFileControls from "features/ResourceManager/components/RMContextFeature/components/FilesHistory/RMFileControls";
import FileDownloadButton from "features/ResourceManager/components/RMContextFeature/components/FilesHistory/FileDownloadButton";

const ResourceManagerType = Symbol("Types#ResourceManager");

const ElementTypes = {
  Options: [{ label: "Resource Manager", value: ResourceManagerType }],
};

const fieldLabel = (field) => `${field.breadcrumbs.replace(".", "/")}/${field.name}`;

const fieldsToOption = (resourceField) => ({
  label: fieldLabel(resourceField),
  value: resourceField,
});

const fileLabel = (file) => {
  const [name, extension] = file.name.split(".");
  return `${name}[v${moment(file.updated_at).format("YYYY.MM.DD hh:mm:ss")}]_${file.provided.full_name}_${
    file.status
  }.${extension}`;
};

const filesToOption = (resourceFieldFile) => ({ label: fileLabel(resourceFieldFile), value: resourceFieldFile });

const findOptionByValueId = (options, id) => options.find((option) => option?.value?.id === id);

const UserMSFieldManagerForm = (props) => {
  const {
    userId,
    rmFieldId: initialRmFieldId,
    rmFieldFileId: initialRmFieldFileId,
    submitting,
    onSubmit: propOnSubmit,
  } = props;
  // Resource Field
  const [field, setField] = useState(null);
  const { data: fieldOptions = [], isLoading: fieldsIsLoading } = useUserMSResourceFields(
    { userId },
    {
      select: (fields) => fields.map(fieldsToOption),
      onSuccess: (options) => {
        const option = findOptionByValueId(options, initialRmFieldId);

        option && setField(option);
      },
    }
  );
  // Resource Field Files
  const rmFieldId = field?.value?.id;
  const fileFormField = useFormField(null, [Validators.required], { useAdvanced: true });
  const { data: fileOptions = [], isLoading: filesIsLoading } = useUserRMFieldFiles(
    { rmFieldId, userId },
    {
      refetchOnWindowFocus: false,
      select: (files) => files.map(filesToOption),
      onSuccess: (options) => {
        const option = findOptionByValueId(options, initialRmFieldFileId);

        option && fileFormField.setValue(option);
      },
    }
  );

  const [isEditing, setEditing] = useState(false);
  const file = useMemo(() => fileFormField.value?.value, [fileFormField]);

  useEffect(() => {
    if (!file || !file.is_latest_version) {
      setEditing(false);
      return;
    }

    setEditing(file.google_drive_doc !== null);
  }, [file]);

  const onEditSuccess = () => setEditing(true);

  const onDeleteSuccess = () => toast.success("File was successfully removed");

  const onFinishEditingSuccess = () => {
    setEditing(false);
    toast.success("File was successfully edited");
  };

  const fileId = file?.id;
  const downloadRMFIle = useDownloadRMFile({ fileId, filename: file?.name });
  const editRMFile = useEditRMFile({ fileId }, { onSuccess: onEditSuccess });
  // That mutations used for user scope (with user QueryKey)
  const deleteRMFile = useDeleteUserRMFile({ fileId, fieldId: rmFieldId, userId }, { onSuccess: onDeleteSuccess });
  const finishRMFile = useFinishUserRMFile(
    { fileId, fieldId: rmFieldId, userId },
    { onSuccess: onFinishEditingSuccess }
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => void fileFormField.setValue(null), [field]);

  // Form control
  const form = useFormGroup({ file: fileFormField });

  const onSubmit = () => propOnSubmit(form);

  const openPreview = useOpenRMFileReferencesPreview({ fileId });

  const onPreview = () => openPreview.mutate({ userId });

  return (
    <form className="d-flex flex-wrap mb-1" onSubmit={preventDefault(onSubmit)}>
      <h2 className="h1 font-weight-bold">Current</h2>

      <div className="full-width py-1">
        <label className="label mb-1" htmlFor="element-type">
          Element type
        </label>
        <DeprecatedNmpSelect
          options={ElementTypes.Options}
          value={ElementTypes.Options[0]}
          readonly
          backgroundColor="transparent"
          inputId="element-type"
        />
      </div>

      <div className="full-width py-1">
        <label className="label mb-1" htmlFor="resource-link">
          Resource link
        </label>
        <DeprecatedNmpSelect
          value={field}
          options={fieldOptions}
          onChange={setField}
          loading={fieldsIsLoading}
          searchable
          backgroundColor="transparent"
          inputId="resource-link"
        />
      </div>

      {field ? (
        <div className="full-width py-1">
          <label className="label mb-1" htmlFor="resource-version">
            Version
          </label>
          <DeprecatedNmpSelect
            value={fileFormField.value}
            options={fileOptions}
            onChange={fileFormField.onChange}
            loading={filesIsLoading}
            searchable
            backgroundColor="transparent"
            inputId="resource-version"
          />

          {file ? (
            <div className="d-flex justify-content-end align-items-center py-1" key={file.id}>
              <DeprecatedNmpButton
                className="mx-1"
                color="white"
                type="button"
                onClick={onPreview}
                loading={openPreview.isLoading}
              >
                Preview
              </DeprecatedNmpButton>

              {file?.is_latest_version ? (
                <RMFileControls
                  isEditing={isEditing}
                  mimeType={file.mime_type}
                  onDownload={downloadRMFIle.mutate}
                  downloadIsLoading={downloadRMFIle.isLoading}
                  onEdit={editRMFile.mutate}
                  editIsLoading={editRMFile.isLoading}
                  onDelete={deleteRMFile.mutate}
                  deleteIsLoading={deleteRMFile.isLoading}
                  onFinishEditing={finishRMFile.mutate}
                  finishEditingIsLoading={finishRMFile.isLoading}
                />
              ) : (
                <FileDownloadButton onDownload={downloadRMFIle.mutate} isLoading={downloadRMFIle.isLoading} />
              )}
            </div>
          ) : null}
        </div>
      ) : null}

      <DeprecatedNmpButton className="ml-auto" color="primary" disabled={form.invalid} loading={submitting}>
        Save
      </DeprecatedNmpButton>
    </form>
  );
};

UserMSFieldManagerForm.propTypes = {
  userId: IdType.isRequired,
  rmFieldId: IdType.isRequired,
  rmFieldFileId: IdType.isRequired,
  submitting: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default UserMSFieldManagerForm;
