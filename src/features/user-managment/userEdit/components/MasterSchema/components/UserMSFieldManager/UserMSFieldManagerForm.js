import moment from "moment";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import React, { useEffect, useMemo, useState } from "react";

import { IdType } from "utility/prop-types";
import { preventDefault } from "utility/event-decorators";

import { useFormField, useFormGroup, Validators } from "hooks/use-form";

import NmpSelect from "components/nmp/NmpSelect";
import NmpButton from "components/nmp/NmpButton";

import { useUserMSResourceFields } from "api/User/useUserMSResourceFields";
import { useDownloadRMFile, useEditRMFile } from "api/resourceManager/useRMFieldFiles";
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

  return (
    <form className="d-flex flex-wrap mb-1" onSubmit={preventDefault(onSubmit)}>
      <h2 className="h1 font-weight-bold">Current</h2>

      <div className="full-width py-1">
        <label className="label mb-1" htmlFor="element-type">
          Element type
        </label>
        <NmpSelect
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
        <NmpSelect
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
          <NmpSelect
            value={fileFormField.value}
            options={fileOptions}
            onChange={fileFormField.onChange}
            loading={filesIsLoading}
            searchable
            backgroundColor="transparent"
            inputId="resource-version"
          />

          {file?.is_latest_version ? (
            <div className="d-flex justify-content-end py-1" key={file.id}>
              <RMFileControls
                isEditing={isEditing}
                onDownload={downloadRMFIle.mutate}
                downloadIsLoading={downloadRMFIle.isLoading}
                onEdit={editRMFile.mutate}
                editIsLoading={editRMFile.isLoading}
                onDelete={deleteRMFile.mutate}
                deleteIsLoading={deleteRMFile.isLoading}
                onFinishEditing={finishRMFile.mutate}
                finishEditingIsLoading={finishRMFile.isLoading}
              />
            </div>
          ) : (
            <div className="d-flex justify-content-end py-1">
              <FileDownloadButton onDownload={downloadRMFIle.mutate} isLoading={downloadRMFIle.isLoading} />
            </div>
          )}
        </div>
      ) : null}

      <NmpButton className="ml-auto" color="primary" disabled={form.invalid} loading={submitting}>
        Save
      </NmpButton>
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
